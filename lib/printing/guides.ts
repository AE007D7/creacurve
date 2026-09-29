export type Guide = {
  slug: string; title: string; description: string; category: string; readingMinutes: number;
  intro: string[]; sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  takeaway: string;
};

export const guides: Guide[] = [
  {
    slug: 'first-3d-print-checklist', title: 'Your First 3D Print: A Practical Checklist', category: 'Getting started', readingMinutes: 7,
    description: 'From choosing a small test model to checking the first layer: a careful beginner workflow for a first FDM print.',
    intro: [
      'A first print is most useful when it teaches you how the machine behaves. Choose a small, simple model instead of a large decorative object. A calibration cube or a flat cable clip makes it easier to spot problems and wastes less filament if something goes wrong.',
      'This guide assumes a consumer FDM printer using PLA. Exact temperatures, leveling procedures, and controls vary by printer and filament, so the manufacturer’s instructions and the filament label take priority.'
    ],
    sections: [
      { heading: 'Before you slice', paragraphs: ['Confirm that the printer sits on a stable surface with space around its moving parts. Inspect the build plate for residue and make sure the nozzle is clean. Load dry PLA in the path recommended by the machine maker.'], bullets: ['Choose a model that fits comfortably on the bed.', 'Check the model license before downloading or sharing it.', 'Orient the flattest face down when that avoids unnecessary supports.'] },
      { heading: 'Start with conservative settings', paragraphs: ['Use the slicer profile for your exact printer and nozzle size. A 0.2 mm layer height and moderate speed are common starting points for a 0.4 mm nozzle, but the printer profile should decide the actual values. Avoid changing many settings at once: if a print fails, you want to know which variable mattered.'], bullets: ['Select the material profile for the actual filament.', 'Preview every layer in the slicer and look for floating islands.', 'Check the estimated material use and print time before sending the job.'] },
      { heading: 'Watch the first layer', paragraphs: ['The first layer should form continuous lines that touch each other and adhere without being crushed into a transparent smear. If the filament curls around the nozzle or lines do not stick, stop and address bed cleanliness, leveling, or Z offset before restarting. Do not reach into moving parts or touch a hot nozzle.'] },
      { heading: 'After the print', paragraphs: ['Allow the bed and part to cool. Remove the piece using the method recommended for your build plate. Note the filament, profile, result, and any defects; a short record is more useful than trying to remember what worked next week.'], bullets: ['Check dimensional fit if the part has a purpose.', 'Inspect for loose strands and sharp edges.', 'Save the slicer project alongside the model when possible.'] }
    ], takeaway: 'A successful first print is a repeatable setup: small model, sensible profile, clean bed, careful first-layer check, and notes for the next attempt.'
  },
  {
    slug: 'pla-vs-petg-for-functional-parts', title: 'PLA vs PETG for Functional 3D Prints', category: 'Materials', readingMinutes: 8,
    description: 'Choose between PLA and PETG by considering heat, flexibility, print difficulty, and the job the part must do.',
    intro: ['PLA and PETG are often treated as interchangeable because both work on many desktop FDM printers. They behave differently in use. The right choice depends on where the object will live, how it will be loaded, and whether you can reliably print the material.'],
    sections: [
      { heading: 'Choose for the environment first', paragraphs: ['PLA is approachable and works well for indoor organizers, prototypes, display objects, and parts that stay away from elevated heat. PETG is often a better candidate for parts that need somewhat more temperature tolerance and impact resistance. Neither is a substitute for an engineered safety part. A dark car interior, direct sunlight, or sustained load may challenge a material even if a quick bench test looks fine.'] },
      { heading: 'Expect different print behavior', paragraphs: ['PLA generally adheres and bridges more easily for beginners. PETG can string and may bond very strongly to some build surfaces. Follow the plate manufacturer’s guidance for a release layer when needed; pulling an over-adhered PETG print can damage the surface. Tune temperature and retraction from the filament maker’s range, changing one setting at a time.'], bullets: ['Keep both filaments dry and sealed when stored.', 'Print a small fit test before a large functional piece.', 'Check bed-surface compatibility before printing PETG.'] },
      { heading: 'Design matters as much as material', paragraphs: ['Layer orientation, wall count, fillets, and load direction strongly affect the result. A hook printed so the layer lines split under load may fail even in a tougher filament. Increase the contact area and avoid sharp stress corners. Do not use hobby prints for critical lifting, protective equipment, food contact, or electrical safety without appropriate testing and standards.'] },
      { heading: 'A simple decision rule', paragraphs: ['Start with PLA for indoor, low-stress objects and visual prototypes. Try PETG when the application demands a tougher, less brittle piece or more heat tolerance and your printer can manage it. For either material, test the real part under its intended conditions before relying on it.'] }
    ], takeaway: 'Choose by use conditions, then validate the printed geometry; material names alone do not guarantee performance.'
  },
  {
    slug: 'fix-first-layer-adhesion', title: 'How to Fix First-Layer Adhesion Problems', category: 'Troubleshooting', readingMinutes: 9,
    description: 'A step-by-step diagnostic order for prints that lift, curl, or fail to stick to the build plate.',
    intro: ['When the first layer fails, changing five slicer settings at once makes the cause harder to find. Work through the simplest physical checks before altering the model or profile. The symptoms below focus on common FDM printing with PLA.'],
    sections: [
      { heading: '1. Clean the plate safely', paragraphs: ['Skin oils and leftover adhesive can prevent consistent contact. Let the plate cool, remove it if the manufacturer recommends doing so, and clean it using the method approved for that surface. Avoid solvents on coatings unless the maker explicitly allows them. A clean plate is the fastest variable to rule out.'] },
      { heading: '2. Check leveling and Z offset', paragraphs: ['If adjacent first-layer lines are separate and round, the nozzle may be too far from the surface. If the extruder clicks or the filament is scraped thin, it may be too close. Run the printer’s calibration routine and adjust Z offset in small increments while observing a simple first-layer test. Automatic bed leveling still needs a sensible initial setup.'] },
      { heading: '3. Verify profile and cooling', paragraphs: ['Use temperatures within the filament maker’s stated range and confirm the selected slicer profile matches the installed nozzle and bed. A slower first layer can improve consistency. Strong fan cooling or drafts at the start can cause edges to lift, especially on broad flat parts. Change one factor, rerun the same test, and write down the result.'] },
      { heading: '4. Consider the model footprint', paragraphs: ['A tall object resting on a tiny contact patch may need a brim or a different orientation. A broad flat print may warp as it cools; rounded corners and a suitable enclosure can help for materials that require one. Supports do not automatically solve poor bed adhesion.'], bullets: ['Small contact area: test a brim.', 'Uneven extrusion: check nozzle condition and filament feed.', 'Only one region fails: inspect bed leveling and surface contamination there.'] },
      { heading: 'When to stop', paragraphs: ['Pause if the nozzle digs into the plate, the print detaches and sticks to the hot end, or the machine makes unfamiliar sounds. Let hot components cool before inspection and follow your printer maker’s maintenance instructions.'] }
    ], takeaway: 'Clean, calibrate, observe, then tune. Keep the model and test conditions constant while diagnosing the problem.'
  },
  {
    slug: 'designing-3d-printed-parts-for-fit', title: 'Designing 3D Printed Parts That Actually Fit', category: 'Design', readingMinutes: 8,
    description: 'Understand clearance, orientation, prototypes, and measurement before printing a final functional part.',
    intro: ['A CAD model can be dimensionally perfect and still produce a part that does not fit. Desktop FDM prints vary with machine calibration, material, orientation, and wall geometry. Plan for measurement and iteration rather than treating a single clearance value as universal.'],
    sections: [
      { heading: 'Measure the mating object', paragraphs: ['Use calipers to measure several points on the real object, especially if it is molded, worn, or slightly tapered. Record the smallest and largest values. A nominal diameter printed on packaging is not always the exact feature your design has to fit.'] },
      { heading: 'Add clearance deliberately', paragraphs: ['A snug sliding joint needs space between parts. The needed gap depends on the printer and material, so print a compact clearance test with several labeled gaps before committing to the full design. Holes often print undersized, and horizontal overhangs can change their shape. Test in the same orientation and material as the final piece.'] },
      { heading: 'Design for layer direction', paragraphs: ['FDM parts are often weaker between layers than within a layer. Orient a tab or hook so the expected force is less likely to peel layers apart. Use fillets at inside corners and avoid thin isolated features. If a small tab is essential, print just that region as a prototype and test it before printing the whole object.'] },
      { heading: 'Make iteration inexpensive', paragraphs: ['Print a short section, ring, or joint sample that includes the critical interface. Check fit after the part cools. Record the actual measured size, not only the CAD size, then update the model. When sharing the design, state the printer, material, orientation, and tested clearance so another maker knows what to verify.'], bullets: ['Label each prototype with its size.', 'Measure after cooling.', 'Test assembly and disassembly more than once.'] }
    ], takeaway: 'Fit is a tested relationship between two real objects. Measure, prototype the interface, and document the result.'
  },
  {
    slug: 'choosing-infill-walls-and-orientation', title: 'Walls, Infill, and Orientation: What Matters Most?', category: 'Design', readingMinutes: 8,
    description: 'A practical way to make stronger, lighter prints without assuming that maximum infill solves every problem.',
    intro: ['It is tempting to set infill to 100% when a print needs to be strong. That adds time and material, but strength also depends on walls, layer bonding, geometry, and direction of force. A considered part often performs better than a solid version of a weak shape.'],
    sections: [
      { heading: 'Start with the load path', paragraphs: ['Sketch where force enters the part and where it leaves. A hook bends at its root; a clip flexes at its thinnest section. Increase cross section or add a generous radius near that point before relying on infill. Keep a functional face oriented for accuracy and keep critical tension away from layer separation where feasible.'] },
      { heading: 'Walls create much of the shell', paragraphs: ['Perimeters form the outer structure and define small features. Adding another wall can be more useful than increasing infill for thin brackets, but the result depends on geometry. Check the slicer preview: if a narrow arm contains only one line of extrusion, the CAD thickness or nozzle choice may need attention.'] },
      { heading: 'Use infill according to the part', paragraphs: ['Low or moderate infill can support top surfaces and reduce weight in noncritical objects. More infill may help with compression and with supporting broad top layers. Different patterns have different print paths; there is no universally strongest percentage or pattern for every load case. Print comparable specimens when the answer matters.'] },
      { heading: 'Test what you plan to use', paragraphs: ['Print a small version with the intended material, walls, infill, and orientation. Test it in the direction and environment it will actually experience. Hobby FDM prints should not be trusted for safety-critical loads based on slicer settings alone.'] }
    ], takeaway: 'Strength begins with geometry and orientation. Use walls and infill to support the design, then test the finished print.'
  },
  {
    slug: 'how-to-store-3d-printer-filament', title: 'How to Store 3D Printer Filament', category: 'Materials', readingMinutes: 6,
    description: 'Keep filament labeled, protected, and ready for reliable printing with a simple storage routine.',
    intro: ['Moisture uptake varies by material and by the humidity of your room. Poor storage can contribute to stringing, surface blemishes, inconsistent extrusion, and brittle handling. A modest storage system helps you separate a wet spool from a slicer or hardware problem.'],
    sections: [
      { heading: 'Use a sealed container', paragraphs: ['Keep spools in resealable bags or airtight boxes with fresh desiccant. A humidity indicator can help you notice when the container is no longer dry, but it measures the air in the container rather than the exact moisture in the filament. Keep spools away from direct sun and excessive heat.'] },
      { heading: 'Label every spool', paragraphs: ['Record the material, maker, color, purchase date, and a temperature range from the packaging. Rewind and clip the loose end so it cannot cross under another turn. A tangled spool can interrupt a long print even if the material is otherwise perfect.'] },
      { heading: 'Dry only when needed and safely', paragraphs: ['If a spool produces popping, bubbles, or unusual stringing despite a known-good profile, moisture is one possible cause. Use a purpose-built dryer or a method specifically approved for that material and spool. Temperature limits differ, and excessive heat can deform a plastic spool or filament. Desiccant in a box helps maintain dryness but generally does not quickly dry an already wet spool.'] },
      { heading: 'Keep a reference print', paragraphs: ['When a fresh spool prints well, save the profile and a small sample. If quality changes later, compare with the same file and settings. This makes it easier to decide whether to dry the filament, inspect the printer, or adjust the profile.'] }
    ], takeaway: 'Seal, label, and compare. Good filament storage is a simple way to make troubleshooting more reliable.'
  }
];
export function getGuide(slug: string) { return guides.find((guide) => guide.slug === slug); }
