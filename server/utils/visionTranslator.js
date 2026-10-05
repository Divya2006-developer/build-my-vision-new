/**
 * Vision Translator Engine
 * Bridges the gap between non-technical client desires and professional architectural/engineering terminology.
 */

function translateVisionToArchitecturalSpecs(visionData) {
  const {
    building_type,
    style_preference = '',
    description = '',
    special_requirements = '',
    num_floors = 1,
    rooms_needed = '',
    plot_dimensions = ''
  } = visionData;

  const text = `${description} ${special_requirements} ${rooms_needed}`.toLowerCase();

  // 1. Fenestration & Natural Daylight Analysis
  let daylightSpec = 'Standard fenestration with operable casement windows for balanced natural ventilation.';
  if (text.includes('light') || text.includes('sun') || text.includes('bright') || text.includes('window')) {
    daylightSpec = 'High-performance solar orientation: East/South-facing clerestory glazing, floor-to-ceiling curtain walls, and UV-filtering double-glazed units for daylight factor optimization without thermal overheating.';
  }

  // 2. Spatial Planning & Zoning
  let spatialSpec = `${num_floors}-story program with clear distinction between public entertaining zones and private resting quarters.`;
  if (text.includes('open') || text.includes('spacious') || text.includes('gathering')) {
    spatialSpec = 'Open-concept continuous spatial flow with column-free spans, integrating kitchen-dining-living into a unified great room with visual axis to outdoor courtyard.';
  } else if (text.includes('cozy') || text.includes('private') || text.includes('quiet') || text.includes('partition')) {
    spatialSpec = 'Cellular zoning with acoustic threshold partitions, alcove quiet zones, and dedicated acoustic buffers between active social spaces and work/rest quarters.';
  }

  // 3. Structural & Materials Specification
  let structuralSpec = 'Reinforced concrete post-and-beam or light-gauge steel framing with standard drywall cladding.';
  if (style_preference.toLowerCase().includes('scandinavian') || text.includes('wood') || text.includes('timber') || text.includes('warm')) {
    structuralSpec = 'Glulam / Mass Timber hybrid structural frame, engineered oak finishes, acoustic wood-slat cladding, and natural textured plaster.';
  } else if (style_preference.toLowerCase().includes('industrial') || style_preference.toLowerCase().includes('brutalist') || text.includes('concrete')) {
    structuralSpec = 'Exposed board-formed concrete structural members, matte black structural steel trusses, polished concrete screed flooring, and raw industrial joinery.';
  } else if (style_preference.toLowerCase().includes('sustainable') || text.includes('eco') || text.includes('green') || text.includes('solar')) {
    structuralSpec = 'Thermally broken mass timber construction, low-embodied-carbon hempcrete/cellulose insulation, green-roof load bearing capabilities, and reclaimed timber facades.';
  }

  // 4. MEP & Sustainability Engineering
  const sustainabilityFactors = [];
  if (text.includes('solar') || text.includes('energy') || text.includes('efficient')) {
    sustainabilityFactors.push('Rooftop Photovoltaic (PV) array conduit pre-install & inverter battery storage provision.');
  }
  if (text.includes('green') || text.includes('garden') || text.includes('plants') || text.includes('roof')) {
    sustainabilityFactors.push('Integrated biophilic living wall system, rainwater greywater catchment, and sedum green roof.');
  }
  if (text.includes('quiet') || text.includes('sound') || text.includes('noise')) {
    sustainabilityFactors.push('STC 55+ acoustic partition assemblies and floating sub-floor decoupling for sound transmission loss.');
  }
  if (text.includes('wheelchair') || text.includes('accessible') || text.includes('elderly')) {
    sustainabilityFactors.push('ADA Universal Design compliance: zero-threshold entries, 36"+ minimum door clearance, and accessible turning radius.');
  }
  if (sustainabilityFactors.length === 0) {
    sustainabilityFactors.push('Passive cross-ventilation orientation, smart energy-star HVAC split systems, and low-VOC paints.');
  }

  // 5. Questions for Kickoff Alignment
  const kickoffQuestions = [
    'Confirm preferred floor-to-ceiling heights (standard 9ft vs voluminous 10-12ft).',
    'Review municipal setback requirements and zoning height restrictions for plot.',
    'Confirm desired thermal insulation standard (Code compliance vs Net-Zero / Passive House).'
  ];

  if (building_type === 'school_educational') {
    kickoffQuestions.push('Verify student egress capacity, emergency fire exits, and flexible modular classroom configurations.');
  } else if (building_type === 'commercial_building' || building_type === 'retail_cafe') {
    kickoffQuestions.push('Review customer footfall flow, loading dock access, ADA public restrooms, and storefront signage visibility.');
  }

  return {
    architectural_classification: `${style_preference} ${building_type.replace(/_/g, ' ').toUpperCase()}`,
    spatial_layout: spatialSpec,
    fenestration_and_lighting: daylightSpec,
    structural_and_materials: structuralSpec,
    sustainability_and_mep: sustainabilityFactors,
    kickoff_alignment_checklist: kickoffQuestions,
    generated_at: new Date().toISOString()
  };
}

module.exports = { translateVisionToArchitecturalSpecs };
