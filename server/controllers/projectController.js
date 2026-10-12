const { db } = require('../config/db');
const { translateVisionToArchitecturalSpecs } = require('../utils/visionTranslator');

exports.createProject = async (req, res) => {
  try {
    const {
      title,
      building_type,
      plot_dimensions,
      num_floors = 1,
      rooms_needed,
      style_preference,
      budget_range,
      timeline_preference,
      description,
      special_requirements,
      inspiration_urls = [],
      designer_id = null
    } = req.body;

    if (!title || !building_type || !style_preference || !description) {
      return res.status(400).json({ error: 'Title, building type, style preference, and description are required' });
    }

    // Auto-translate client vision into professional architectural parameters
    const technical_summary = translateVisionToArchitecturalSpecs({
      building_type,
      style_preference,
      description,
      special_requirements,
      num_floors,
      rooms_needed,
      plot_dimensions
    });

    const project = await db.projects.create({
      customer_id: req.user.id,
      designer_id: designer_id ? Number(designer_id) : null,
      title,
      building_type,
      plot_dimensions,
      num_floors: Number(num_floors) || 1,
      rooms_needed,
      style_preference,
      budget_range: budget_range || 'Mid-range',
      timeline_preference: timeline_preference || '2 - 4 months',
      description,
      special_requirements,
      inspiration_urls: Array.isArray(inspiration_urls) ? inspiration_urls : [],
      technical_summary
    });

    // Notify connected sockets if designer was directly invited
    const io = req.app.get('io');
    if (io && designer_id) {
      io.to(`user_${designer_id}`).emit('new_project_request', {
        projectId: project.id,
        title: project.title,
        customerName: req.user.name
      });
    }

    res.status(201).json({
      message: 'Vision submitted successfully',
      project
    });
  } catch (err) {
    console.error('createProject error:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

exports.getProjects = async (req, res) => {
  try {
    let projects = [];
    if (req.user.role === 'designer') {
      projects = await db.projects.listForDesigner(req.user.id);
    } else {
      projects = await db.projects.listForCustomer(req.user.id);
    }

    res.json(projects);
  } catch (err) {
    console.error('getProjects error:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await db.projects.getById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Authorization check
    if (
      project.customer_id !== req.user.id &&
      project.designer_id !== req.user.id &&
      !(req.user.role === 'designer' && project.status === 'submitted')
    ) {
      return res.status(403).json({ error: 'Unauthorized to view this project' });
    }

    const deliverables = await db.deliverables.listByProject(project.id);
    const proposals = await db.proposals.listByProject(project.id);

    // Fetch revisions for each deliverable
    const deliverablesWithRevisions = await Promise.all(
      deliverables.map(async (d) => {
        const revs = await db.revisions.listByDeliverable(d.id);
        return { ...d, revisions: revs };
      })
    );

    res.json({
      ...project,
      deliverables: deliverablesWithRevisions,
      proposals
    });
  } catch (err) {
    console.error('getProjectById error:', err);
    res.status(500).json({ error: 'Failed to fetch project details' });
  }
};

exports.acceptProject = async (req, res) => {
  try {
    if (req.user.role !== 'designer') {
      return res.status(403).json({ error: 'Only designers can accept project requests' });
    }

    const project = await db.projects.getById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.designer_id && project.designer_id !== req.user.id) {
      return res.status(400).json({ error: 'Project already assigned to another designer' });
    }

    const updated = await db.projects.updateStatus(project.id, 'designer_assigned', req.user.id);

    // Emit live socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`project_${project.id}`).emit('project_status_changed', {
        projectId: project.id,
        status: 'designer_assigned',
        designerId: req.user.id
      });
      io.to(`user_${project.customer_id}`).emit('designer_accepted', {
        projectId: project.id,
        designerName: req.user.name
      });
    }

    res.json({ message: 'Project accepted successfully', project: updated });
  } catch (err) {
    console.error('acceptProject error:', err);
    res.status(500).json({ error: 'Failed to accept project' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const project = await db.projects.getById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Customer or assigned designer can update certain statuses
    const updated = await db.projects.updateStatus(project.id, status);

    const io = req.app.get('io');
    if (io) {
      io.to(`project_${project.id}`).emit('project_status_changed', {
        projectId: project.id,
        status
      });
    }

    res.json({ message: 'Status updated', project: updated });
  } catch (err) {
    console.error('updateStatus error:', err);
    res.status(500).json({ error: 'Failed to update project status' });
  }
};

exports.addDeliverable = async (req, res) => {
  try {
    if (req.user.role !== 'designer') {
      return res.status(403).json({ error: 'Only designers can upload project deliverables' });
    }

    const projectId = req.params.id;
    const project = await db.projects.getById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const {
      stage = 'concept_draft',
      title,
      description,
      file_url,
      file_type = 'image',
      version = 1
    } = req.body;

    if (!title || !file_url) {
      return res.status(400).json({ error: 'Title and file_url are required' });
    }

    const deliverable = await db.deliverables.create({
      project_id: Number(projectId),
      designer_id: req.user.id,
      stage,
      title,
      description,
      file_url,
      file_type,
      version: Number(version) || 1
    });

    // Advance project status to client_review or final_delivered
    let nextStatus = 'client_review';
    if (stage === 'final_delivery') {
      nextStatus = 'final_delivered';
    }
    await db.projects.updateStatus(projectId, nextStatus);

    const io = req.app.get('io');
    if (io) {
      io.to(`project_${projectId}`).emit('new_deliverable', {
        projectId,
        deliverable,
        newStatus: nextStatus
      });
      io.to(`user_${project.customer_id}`).emit('deliverable_ready', {
        projectId,
        title: deliverable.title,
        stage: deliverable.stage
      });
    }

    res.status(201).json({
      message: 'Deliverable uploaded successfully',
      deliverable
    });
  } catch (err) {
    console.error('addDeliverable error:', err);
    res.status(500).json({ error: 'Failed to add deliverable' });
  }
};

exports.updateDeliverableStatus = async (req, res) => {
  try {
    const { deliverableId } = req.params;
    const { status } = req.body; // 'approved' | 'revision_requested'

    const updated = await db.deliverables.updateStatus(deliverableId, status);

    const io = req.app.get('io');
    if (io) {
      io.to(`project_${updated.project_id}`).emit('deliverable_status_changed', {
        deliverableId,
        status
      });
    }

    res.json({ message: 'Deliverable status updated', deliverable: updated });
  } catch (err) {
    console.error('updateDeliverableStatus error:', err);
    res.status(500).json({ error: 'Failed to update deliverable status' });
  }
};

exports.addRevision = async (req, res) => {
  try {
    const { deliverableId } = req.params;
    const { feedback_text, pin_x, pin_y, project_id } = req.body;

    if (!feedback_text) {
      return res.status(400).json({ error: 'Feedback text is required' });
    }

    const revision = await db.revisions.create({
      deliverable_id: Number(deliverableId),
      project_id: Number(project_id),
      customer_id: req.user.id,
      feedback_text,
      pin_x: pin_x !== undefined ? Number(pin_x) : null,
      pin_y: pin_y !== undefined ? Number(pin_y) : null,
      status: 'open'
    });

    // Automatically set deliverable status to revision_requested
    await db.deliverables.updateStatus(deliverableId, 'revision_requested');
    // Set project status back to concept_drafting or client_review
    await db.projects.updateStatus(project_id, 'concept_drafting');

    const io = req.app.get('io');
    if (io) {
      io.to(`project_${project_id}`).emit('new_revision_pin', {
        deliverableId,
        revision
      });
    }

    res.status(201).json({
      message: 'Revision feedback saved',
      revision
    });
  } catch (err) {
    console.error('addRevision error:', err);
    res.status(500).json({ error: 'Failed to add revision feedback' });
  }
};

exports.getProposals = async (req, res) => {
  try {
    const proposals = await db.proposals.listByProject(req.params.id);
    res.json(proposals);
  } catch (err) {
    console.error('getProposals error:', err);
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
};

exports.createProposal = async (req, res) => {
  try {
    if (req.user.role !== 'designer') {
      return res.status(403).json({ error: 'Only designers can create design choice proposals' });
    }

    const { title, category = 'staircase', description, options } = req.body;
    if (!title || !options || !options.length) {
      return res.status(400).json({ error: 'Title and at least one option are required' });
    }

    const proposal = await db.proposals.create({
      project_id: Number(req.params.id),
      designer_id: req.user.id,
      title,
      category,
      description,
      options
    });

    const project = await db.projects.getById(req.params.id);

    // Also notify via socket
    const io = req.app.get('io');
    if (io) {
      io.to(`project_${req.params.id}`).emit('new_proposal', proposal);
    }

    // Auto-create chat message notifying customer
    if (project && project.customer_id) {
      await db.messages.create({
        project_id: Number(req.params.id),
        sender_id: req.user.id,
        receiver_id: project.customer_id,
        message_text: `🎨 Design Options for your review: "${title}". Click on the 'Design Options' tab to view and pick your favorite!`,
        attachment_url: null
      });
    }

    res.status(201).json({ message: 'Design option proposal published', proposal });
  } catch (err) {
    console.error('createProposal error:', err);
    res.status(500).json({ error: 'Failed to create proposal' });
  }
};

exports.chooseProposalOption = async (req, res) => {
  try {
    const { id, proposalId } = req.params;
    const { optionId, optionName, customerNote } = req.body;

    const project = await db.projects.getById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the project customer can choose design options' });
    }

    const updated = await db.proposals.chooseOption(proposalId, optionId, customerNote);

    // Also notify via socket
    const io = req.app.get('io');
    if (io) {
      io.to(`project_${id}`).emit('proposal_chosen', {
        proposalId,
        optionId,
        optionName,
        customerNote
      });
    }

    // Auto-create chat message with the choice
    if (project.designer_id) {
      await db.messages.create({
        project_id: Number(id),
        sender_id: req.user.id,
        receiver_id: project.designer_id,
        message_text: `✅ I have chosen: "${optionName}"! ${customerNote ? `(Note: ${customerNote})` : ''}`,
        attachment_url: null
      });
    }

    res.json({ message: 'Design option selected', proposal: updated });
  } catch (err) {
    console.error('chooseProposalOption error:', err);
    res.status(500).json({ error: 'Failed to choose proposal option' });
  }
};

