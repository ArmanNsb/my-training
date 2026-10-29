/* =====================================================================
   CONFIG — public cloud settings live in cloud-config.js.
   The private owner sync code is entered in Settings and saved locally.
   ===================================================================== */
const CLOUD_CONFIG=window.TRAINING_CLOUD_CONFIG||{};
const CONFIG={
  server:{
    enabled:!!CLOUD_CONFIG.enabled,
    baseUrl:String(CLOUD_CONFIG.baseUrl||''),
    publicKey:String(CLOUD_CONFIG.publishableKey||''),
    token:''
  },
  met:{lifting:5.0}, // MET value used for calorie estimates
  maxSessionMin:240,
  tombstoneDays:30,   // deleted workouts are purged locally after this many days
  overnightHours:6    // an unfinished workout keeps collecting sets past midnight for this long
};

/* ---------- Icons ---------- */
const sv=d=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const IC={
  back:sv('<path d="M15 6l-6 6l6 6"/>'),
  chev:sv('<path d="M9 6l6 6l-6 6"/>'),
  x:sv('<path d="M18 6L6 18M6 6l12 12"/>'),
  check:sv('<path d="M5 12l5 5L20 7"/>'),
  settings:sv('<circle cx="14" cy="6" r="2"/><path d="M4 6h8M16 6h4"/><circle cx="8" cy="12" r="2"/><path d="M4 12h2M10 12h10"/><circle cx="17" cy="18" r="2"/><path d="M4 18h11M19 18h1"/>'),
  yt:sv('<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor"/>'),
  ext:sv('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
  plus:sv('<path d="M12 5v14M5 12h14"/>'),
  minus:sv('<path d="M5 12h14"/>'),
  pause:sv('<path d="M8 5v14M16 5v14"/>'),
  play:sv('<path d="M7 4v16l13-8z"/>'),
  refresh:sv('<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>'),
  info:sv('<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/>'),
  clock:sv('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>'),
  flame:sv('<path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-7c1.5 1 2 2 2 3c0-3 1-4 1-6z"/>'),
  trend:sv('<path d="M3 17l6-6l4 4l8-8M14 7h7v7"/>'),
  up:sv('<path d="M12 19V5M6 11l6-6l6 6"/>'),
  down:sv('<path d="M12 5v14M6 13l6 6l6-6"/>'),
  link:sv('<path d="M9 15l6-6M11 6l.5-.5a4 4 0 0 1 5.66 5.66L16.5 12M13 18l-.5.5a4 4 0 0 1-5.66-5.66L7.5 12"/>'),
  trash:sv('<path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>'),
  download:sv('<path d="M12 4v11M7 10l5 5l5-5M5 20h14"/>'),
  upload:sv('<path d="M12 20V9M7 14l5-5l5 5M5 4h14"/>'),
  abs:sv('<rect x="6" y="3" width="12" height="18" rx="5"/><path d="M12 3v18M6 9h12M6 15h12"/>'),
  calendar:sv('<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M16 3v4M8 3v4M4 11h16"/>'),
  chart:sv('<path d="M4 20h16M7 16v-5M12 16V6M17 16v-8"/>'),
  trophy:sv('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M5 9a2 2 0 0 1 0-4h2M19 9a2 2 0 0 0 0-4h-2"/>'),
  alert:sv('<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>'),
  cloud:sv('<path d="M7 18a4.6 4.4 0 0 1 0-9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7z"/>'),
  flag:sv('<path d="M5 21V4M5 4h11l-2 4l2 4H5"/>'),
  dumbbell:sv('<path d="M2 12h1M6 8H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2M6 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1M9 12h6M15 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1M18 8h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2M22 12h-1"/>')
};

/* ---------- Exercise library ---------- */
const EX={
  inclineSmith:{name:'Incline Smith Press',type:'compound',group:'Chest',muscles:['Upper chest','Front delts','Triceps'],img:['Smith_Machine_Incline_Bench_Press','Barbell_Incline_Bench_Press_-_Medium_Grip'],yt:'incline smith machine press proper form',
    steps:['Set the bench to about 30° and position it so the bar lowers to your upper chest, just below the collarbones.','Grip slightly wider than shoulder width. Pull your shoulder blades back and down and plant your feet.','Unhook the bar and lower it under control (2–3 seconds) until it lightly touches your upper chest.','Press back up in a straight line, stopping just short of a hard lockout.'],
    tips:['Keep elbows roughly 45–60° from your torso, not flared straight out.','Keep your upper back pinned to the bench for the whole set.']},
  chestRow:{name:'Chest-Supported Row',type:'compound',group:'Back',muscles:['Mid back','Lats','Rear delts','Biceps'],img:['Lying_T-Bar_Row','Dumbbell_Incline_Row','Bent_Over_Two-Dumbbell_Row'],yt:'chest supported row proper form',
    steps:['Set the chest pad so you can reach the handles with arms fully extended and a stretch in your upper back.','Press your chest firmly into the pad and keep your neck neutral.','Pull the handles toward your lower ribs, driving your elbows back and squeezing your shoulder blades together.','Lower slowly to a full stretch, letting your shoulder blades spread apart.'],
    tips:['Keep your chest on the pad — no lifting off or swinging.','Think "elbows to back pockets," not "hands to chest."']},
  latPulldown:{name:'Neutral-Grip Lat Pulldown',type:'compound',group:'Back',muscles:['Lats','Upper back','Biceps'],img:['V-Bar_Pulldown','Close-Grip_Front_Lat_Pulldown','Wide-Grip_Lat_Pulldown'],yt:'neutral grip lat pulldown proper form',
    steps:['Attach a neutral-grip (V-bar or parallel) handle and lock your thighs under the pad.','Sit tall with a slight backward lean of about 10–15° and your chest up.','Pull the handle to your upper chest by driving your elbows down toward your hips.','Return slowly until your arms are straight and your lats are fully stretched.'],
    tips:['Don\'t yank with momentum or lean far back to finish reps.','Lead with your elbows — your hands are just hooks.']},
  machineChest:{name:'Machine Chest Press',type:'compound',group:'Chest',muscles:['Chest','Front delts','Triceps'],img:['Machine_Bench_Press','Leverage_Chest_Press'],yt:'machine chest press proper form',
    steps:['Adjust the seat so the handles line up with your mid chest.','Set your shoulder blades back against the pad and keep your feet flat.','Press the handles forward until your arms are nearly straight.','Return under control until you feel a deep stretch across your chest.'],
    tips:['Don\'t let your shoulders roll forward at the end of the press.','Control the stretch — no bouncing out of the bottom.']},
  cableLateral:{name:'Cable Lateral Raise',type:'isolation',group:'Shoulders',muscles:['Side delts'],img:['Cable_Seated_Lateral_Raise','One-Arm_Side_Laterals','Side_Lateral_Raise'],yt:'cable lateral raise proper form',
    steps:['Set the pulley at the lowest position, stand side-on to the machine and grab the handle with your far hand.','Lean slightly forward and keep a small, fixed bend in your elbow.','Raise your arm out to the side to about shoulder height, leading with the elbow.','Lower slowly, keeping tension on the cable at the bottom.'],
    tips:['No shrugging — keep your traps relaxed.','Light and strict beats heavy and swinging.']},
  reversePecDeck:{name:'Reverse Pec Deck',type:'isolation',group:'Shoulders',muscles:['Rear delts','Upper back'],img:['Reverse_Machine_Flyes','Reverse_Flyes'],yt:'reverse pec deck rear delt fly proper form',
    steps:['Set the handles to the rear position and adjust the seat so they\'re at shoulder height.','Face the pad with your chest against it and grab the handles.','Sweep your arms out and back in a wide arc with a slight bend in the elbows.','Return slowly until your hands are nearly together.'],
    tips:['Think "push your hands out wide," not "squeeze the shoulder blades."','Smooth, controlled reps — no jerking.']},
  ropePushdown:{name:'Rope Triceps Pushdown',type:'isolation',group:'Arms',muscles:['Triceps'],img:['Triceps_Pushdown_-_Rope_Attachment','Triceps_Pushdown'],yt:'rope triceps pushdown proper form',
    steps:['Attach a rope to a high pulley and stand close with a slight forward lean.','Pin your elbows to your sides.','Push down until your arms are fully straight, spreading the rope ends apart at the bottom.','Let your forearms come back up just past parallel while your elbows stay fixed.'],
    tips:['Only your forearms should move.','Get a full lockout on every rep.']},
  inclineCurl:{name:'Incline Dumbbell Curl',type:'isolation',group:'Arms',muscles:['Biceps (long head)'],img:['Incline_Dumbbell_Curl','Alternate_Incline_Dumbbell_Curl'],yt:'incline dumbbell curl proper form',
    steps:['Set a bench to 45–60° and sit back with your arms hanging straight down.','Turn your palms forward with elbows slightly behind your torso.','Curl the dumbbells up without letting your elbows drift forward.','Lower all the way down to a full stretch.'],
    tips:['Keep your shoulders back against the bench.','The deep stretch at the bottom is the point of this exercise.']},
  hackSquat:{name:'Hack Squat',type:'compound',group:'Quads',muscles:['Quads','Glutes'],img:['Hack_Squat','Barbell_Hack_Squat'],yt:'hack squat machine proper form',
    steps:['Set your back and shoulders flat against the pad with feet shoulder-width in the middle of the platform.','Release the safeties and brace your core.','Lower under control as deep as you can while keeping your back flat and heels down.','Drive through your whole foot to stand, without slamming into knee lockout.'],
    tips:['A lower foot placement shifts more work to the quads.','Don\'t let your lower back peel off the pad at the bottom.']},
  rdl:{name:'Romanian Deadlift',type:'compound',group:'Hamstrings',muscles:['Hamstrings','Glutes','Lower back'],img:['Romanian_Deadlift','Stiff-Legged_Barbell_Deadlift'],yt:'romanian deadlift proper form',
    steps:['Stand tall holding the bar at your hips, feet hip-width, knees softly bent.','Push your hips back and slide the bar down your thighs with a flat back.','Lower until you feel a strong hamstring stretch, usually around mid-shin.','Drive your hips forward to stand tall and squeeze your glutes.'],
    tips:['Keep the bar close to your legs the whole time.','It\'s a hip hinge — your knee angle barely changes.']},
  bulgarian:{name:'Bulgarian Split Squat',type:'compound',group:'Quads',side:true,muscles:['Quads','Glutes','Adductors'],img:['Split_Squat_with_Dumbbells','Dumbbell_Lunges'],yt:'bulgarian split squat proper form',
    steps:['Place your rear foot laces-down on a bench, front foot about a stride ahead.','Hold dumbbells at your sides with your torso tall or slightly forward.','Lower straight down until your back knee nearly touches the floor.','Push through your front foot to rise. Finish all reps, then switch legs.'],
    tips:['Slight forward lean = more glutes; upright torso = more quads.','Keep your front heel down throughout.']},
  seatedLegCurl:{name:'Seated Leg Curl',type:'isolation',group:'Hamstrings',muscles:['Hamstrings'],img:['Seated_Leg_Curl','Lying_Leg_Curls'],yt:'seated leg curl proper form',
    steps:['Align your knees with the machine\'s pivot point and lock the thigh pad down snugly.','Lean your torso slightly forward to increase the hamstring stretch.','Curl your heels under the seat as far as possible.','Return slowly until your legs are almost straight.'],
    tips:['Leaning forward makes this exercise more effective.','Keep your hips planted on the seat.']},
  standingCalf:{name:'Standing Calf Raise',type:'isolation',group:'Calves',muscles:['Calves (gastrocnemius)'],img:['Standing_Calf_Raises','Standing_Dumbbell_Calf_Raise'],yt:'standing calf raise proper form',
    steps:['Place the balls of your feet on the edge of the platform with knees straight but not locked.','Lower your heels into a deep stretch and pause for 1–2 seconds.','Rise as high as you can onto your toes.','Lower under control.'],
    tips:['The pause at the bottom removes the bounce.','Full range of motion beats heavy partial reps.']},
  pullUp:{name:'Assisted Pull-Up',type:'compound',group:'Back',assist:true,muscles:['Lats','Upper back','Biceps'],img:['Pullups','Band_Assisted_Pull-Up','Chin-Up'],yt:'pull up proper form',
    steps:['Grip the bar slightly wider than shoulder width, palms facing away.','Start from a dead hang with your core braced and legs slightly in front.','Pull your elbows down toward your ribs until your chin clears the bar.','Lower all the way back to a full hang.'],
    tips:['Use the assisted machine or a band to stay in the 6–10 rep range.','Log the assistance weight. Leave it empty for bodyweight — less assistance counts as progress.','No kipping or swinging.']},
  dbBench:{name:'Flat Dumbbell Bench Press',type:'compound',group:'Chest',muscles:['Chest','Front delts','Triceps'],img:['Dumbbell_Bench_Press'],yt:'dumbbell bench press proper form',
    steps:['Sit with the dumbbells on your thighs and kick them up as you lie back.','Retract your shoulder blades and plant your feet.','Lower the dumbbells to chest level with elbows at about 45°.','Press up and slightly inward until your arms are nearly straight.'],
    tips:['Use the deeper stretch that dumbbells allow — under control.','Don\'t clang the dumbbells together at the top.']},
  seatedRow:{name:'Seated Cable Row',type:'compound',group:'Back',muscles:['Mid back','Lats','Rear delts'],img:['Seated_Cable_Rows'],yt:'seated cable row proper form',
    steps:['Sit with feet on the platform, knees slightly bent, and grab the handle.','Sit tall with your chest up.','Pull the handle to your lower stomach, keeping your elbows close.','Let your arms extend and your shoulder blades move forward for a full stretch.'],
    tips:['A little torso movement is fine; big rocking isn\'t.','Pause briefly at the squeeze.']},
  machineShoulder:{name:'Machine Shoulder Press',type:'compound',group:'Shoulders',muscles:['Front delts','Side delts','Triceps'],img:['Machine_Shoulder_Military_Press','Leverage_Shoulder_Press','Dumbbell_Shoulder_Press'],yt:'machine shoulder press proper form',
    steps:['Adjust the seat so the handles start around shoulder or chin level.','Keep your back flat against the pad.','Press overhead until your arms are nearly straight.','Lower under control to the starting position.'],
    tips:['Don\'t arch away from the back pad.','Keep your wrists stacked over your elbows.']},
  lowHighFly:{name:'Low-to-High Cable Fly',type:'isolation',group:'Chest',muscles:['Upper chest','Front delts'],img:['Low_Cable_Crossover','Cable_Crossover'],yt:'low to high cable fly proper form',
    steps:['Set both pulleys to the lowest position and step forward into a staggered stance.','Keep a slight, fixed bend in your elbows with palms facing forward.','Sweep your hands up and together in an arc to about upper-chest or chin height.','Return slowly until you feel a stretch across your chest.'],
    tips:['Keep the elbow angle fixed — it\'s a hug, not a press.','Squeeze your upper chest at the top.']},
  rearDeltFly:{name:'Rear-Delt Cable Fly / Reverse Pec Deck',type:'isolation',group:'Shoulders',muscles:['Rear delts','Upper back'],img:['Cable_Rear_Delt_Fly','Reverse_Machine_Flyes'],yt:'rear delt cable fly proper form',
    steps:['Set both pulleys at shoulder height. Cross the cables: left hand holds the right cable, right hand the left.','Step back with your arms extended in front at shoulder height.','Pull your hands out and back in a wide arc until they\'re in line with your body.','Return slowly. (Or use the reverse pec deck — same movement.)'],
    tips:['Think "push hands out wide" to keep it on the rear delts.','Use light weight and keep it smooth.']},
  overheadExt:{name:'Overhead Cable Triceps Extension',type:'isolation',group:'Arms',muscles:['Triceps (long head)'],img:['Cable_Rope_Overhead_Triceps_Extension'],yt:'overhead cable triceps extension proper form',
    steps:['Attach a rope at a low or mid pulley, face away and hold the rope behind your head.','Use a staggered stance and slight forward lean, elbows pointing forward near your head.','Extend your arms until they\'re straight.','Bend your elbows to a deep stretch behind your head.'],
    tips:['Keep your elbows from flaring wide.','The stretched position is what makes this exercise valuable.']},
  preacherCurl:{name:'Preacher Curl',type:'isolation',group:'Arms',muscles:['Biceps','Brachialis'],img:['Preacher_Curl','Machine_Preacher_Curls','One_Arm_Dumbbell_Preacher_Curl'],yt:'preacher curl proper form',
    steps:['Adjust the seat so your armpits sit snugly over the top of the pad.','Rest your arms flat on the pad with an underhand grip.','Curl up until just before your forearms are vertical.','Lower slowly until your arms are nearly straight.'],
    tips:['Don\'t drop into a hard lockout at the bottom.','Keep your upper arms glued to the pad.']},
  hipThrust:{name:'Hip Thrust',type:'compound',group:'Glutes',muscles:['Glutes','Hamstrings'],img:['Barbell_Hip_Thrust','Barbell_Glute_Bridge'],yt:'barbell hip thrust proper form',
    steps:['Rest your upper back (bottom of the shoulder blades) on a bench edge with a padded bar over your hips.','Plant your feet about shoulder-width so your shins are vertical at the top.','Drive through your heels to lift your hips until your torso is parallel to the floor.','Pause, squeeze your glutes, then lower under control.'],
    tips:['Chin tucked, ribs down — don\'t overarch your lower back.','Move from the hips, not the lower back.']},
  legPress:{name:'Leg Press',type:'compound',group:'Quads',muscles:['Quads','Glutes'],img:['Leg_Press'],yt:'leg press proper form',
    steps:['Sit with your back and hips flat against the seat, feet shoulder-width in the middle of the platform.','Release the safety handles.','Lower until your knees reach about 90° or deeper, as long as your hips don\'t curl up.','Press back up without locking your knees.'],
    tips:['Your lower back must stay on the pad.','Knees track in line with your toes.']},
  lyingLegCurl:{name:'Lying Leg Curl',type:'isolation',group:'Hamstrings',muscles:['Hamstrings'],img:['Lying_Leg_Curls'],yt:'lying leg curl proper form',
    steps:['Lie face down with your knees just off the pad edge and the roller just above your heels.','Grip the handles and press your hips into the pad.','Curl your heels toward your glutes.','Lower slowly until your legs are nearly straight.'],
    tips:['Keep your hips down throughout.','Control the lowering phase.']},
  backExt:{name:'45° Back Extension',type:'isolation',group:'Glutes',muscles:['Glutes','Hamstrings','Lower back'],img:['Hyperextensions_Back_Extensions','Hyperextensions_With_No_Hyperextension_Bench'],yt:'45 degree back extension glute focus proper form',
    steps:['Set the pad just below your hip crease with heels locked under the rollers.','Cross your arms on your chest, or hold a plate for extra load.','Hinge down at the hips to a strong hamstring stretch.','Rise until your body forms a straight line — don\'t overextend.'],
    tips:['Slightly rounding your upper back and squeezing your glutes shifts it toward the glutes.','Stop at a straight line, not past it.']},

  inclineDb:{name:'Incline Dumbbell Press',type:'compound',group:'Chest',muscles:['Upper chest','Front delts','Triceps'],img:['Incline_Dumbbell_Press','Dumbbell_Bench_Press'],yt:'incline dumbbell press proper form',
    steps:['Set the bench to about 30° and start with the dumbbells over your upper chest.','Pull your shoulder blades back and down, keep your feet planted and brace your torso.','Lower the dumbbells under control until your elbows are slightly below your torso.','Press up and slightly inward without banging the dumbbells together.'],
    tips:['Keep your elbows roughly 45–60° from your torso.','Use a controlled stretch at the bottom instead of bouncing.']},
  oneArmPulldown:{name:'One-Arm Cable Lat Pulldown',type:'compound',group:'Back',side:true,muscles:['Lats','Biceps'],img:['One_Arm_Lat_Pulldown','Close-Grip_Front_Lat_Pulldown'],yt:'single arm cable lat pulldown proper form',
    steps:['Set a single handle high and sit or kneel so the cable starts above you.','Reach up for a full lat stretch while keeping your ribs controlled.','Drive your elbow down and slightly toward your hip.','Return slowly to a full stretch, then finish all reps before switching sides.'],
    tips:['Think elbow to hip instead of pulling with your hand.','Avoid twisting your torso to finish the rep.']},
  inclineMachinePress:{name:'Incline Machine Chest Press',type:'compound',group:'Chest',muscles:['Upper chest','Front delts','Triceps'],img:['Leverage_Incline_Chest_Press','Machine_Bench_Press'],yt:'incline chest press machine proper form',
    steps:['Adjust the seat so the handles line up with your upper chest.','Set your shoulder blades back against the pad and plant your feet.','Press forward and slightly upward until your arms are nearly straight.','Return slowly until you feel a stretch across the upper chest.'],
    tips:['Keep your shoulders from rolling forward.','Use a controlled bottom position and avoid bouncing.']},
  lateralMachine:{name:'Lateral Raise Machine',type:'isolation',group:'Shoulders',muscles:['Side delts'],img:['Machine_Lateral_Raise','Side_Lateral_Raise'],yt:'lateral raise machine proper form',
    steps:['Adjust the seat so your shoulders line up naturally with the machine pivot.','Place your arms against the pads with a slight bend at the elbows.','Raise the pads out to the sides until your upper arms are around shoulder height.','Lower slowly while keeping tension on the side delts.'],
    tips:['Do not shrug your shoulders toward your ears.','Use strict reps rather than chasing heavy weight.']},
  cableCrunch:{name:'Cable Crunch',type:'isolation',group:'Core',muscles:['Abs'],img:['Cable_Crunch','Kneeling_Cable_Crunch_With_Alternating_Oblique_Twists'],yt:'cable crunch proper form',
    steps:['Attach a rope high, kneel facing the stack and hold the rope beside your head.','Brace your hips in place and start with your abs stretched.','Curl your ribs toward your pelvis by flexing your spine.','Return slowly without turning it into a hip hinge.'],
    tips:['Move through the spine, not by sitting your hips back.','Exhale hard near the bottom and keep the reps controlled.']},
  reverseLunge:{name:'Reverse Lunge',type:'compound',group:'Quads',side:true,muscles:['Quads','Glutes','Adductors'],img:['Dumbbell_Rear_Lunge','Barbell_Rear_Lunge'],yt:'reverse lunge proper form',
    steps:['Stand tall with dumbbells at your sides or bodyweight only.','Step one leg back and lower until the front thigh approaches parallel.','Keep the front foot planted and knee tracking over the toes.','Drive through the front foot to return, then repeat on the same or alternating side.'],
    tips:['Take a long enough step that your front heel stays down.','A slight forward torso lean increases glute involvement.']},
  legExtension:{name:'Leg Extension',type:'isolation',group:'Quads',muscles:['Quads'],img:['Leg_Extensions','Single-Leg_High-Box_Squat'],yt:'leg extension proper form',
    steps:['Adjust the seat so your knees line up with the machine pivot and the pad sits above your ankles.','Brace your hips and back against the pad.','Extend your knees until your legs are almost straight and squeeze the quads.','Lower under control to a comfortable stretch.'],
    tips:['Do not kick or use momentum.','Control the last few inches on the way down.']},
  hangingKneeRaise:{name:'Hanging Knee Raise',type:'isolation',group:'Core',muscles:['Abs','Hip flexors'],img:['Hanging_Leg_Raise','Knee_Hip_Raise_On_Parallel_Bars'],yt:'hanging knee raise proper form',
    steps:['Hang from a bar with your shoulders active and legs together.','Brace your core and curl your pelvis slightly under.','Raise your knees toward your chest without swinging.','Lower slowly until your legs hang straight again.'],
    tips:['Think about curling your pelvis, not only lifting your thighs.','If grip is limiting, use a captain\'s chair version.']},
  seatedCalf:{name:'Seated Calf Raise',type:'isolation',group:'Calves',muscles:['Calves (soleus)'],img:['Seated_Calf_Raise','Barbell_Seated_Calf_Raise'],yt:'seated calf raise proper form',
    steps:['Sit with the pad snug on your lower thighs and the balls of your feet on the platform.','Release the safety and lower your heels into a deep stretch. Pause.','Push up as high as you can.','Lower under control.'],
    tips:['Pause at the bottom of every rep.','Full range of motion beats heavy weight.']}
};

/* ---------- Clickable exercise variants ----------
   Every option has its own exercise id, so its weights/reps/progress history
   remain separate from the main movement and from the other alternatives. */
function addVariant(id,base,name,o={}){
  const b=EX[base];
  EX[id]={...b,...o,name,
    img:o.img||b.img.slice(),
    yt:o.yt||`${name} proper form`,
    steps:o.steps||b.steps.slice(),
    tips:o.tips||b.tips.slice()
  };
}
addVariant('machineRow','chestRow','Machine Row',{img:['Machine_Row','Lying_T-Bar_Row','Seated_Cable_Rows'],yt:'machine row proper form'});
addVariant('cableChestPress','machineChest','Cable Chest Press',{img:['Cable_Chest_Press','Cable_Crossover','Machine_Bench_Press'],yt:'standing cable chest press proper form',steps:['Set both pulleys around mid-chest height and step forward into a stable split stance.','Start with your elbows slightly behind your torso and shoulder blades gently set back.','Press the handles forward and slightly inward until your arms are nearly straight.','Return slowly until you feel a controlled chest stretch without letting the weight pull your shoulders forward.'],tips:['Keep your ribs stacked instead of leaning back.','Use a smooth arc and keep your shoulders down.']});
addVariant('dbLateral','cableLateral','Dumbbell Lateral Raise',{img:['Side_Lateral_Raise','Seated_Side_Lateral_Raise'],yt:'dumbbell lateral raise proper form',steps:['Stand tall with dumbbells by your sides and a soft bend in your elbows.','Lean very slightly forward and keep your shoulders down.','Raise the dumbbells out to the sides until your upper arms are around shoulder height.','Lower slowly without letting the dumbbells crash into your thighs.'],tips:['Lead with your elbows, not your hands.','Use a weight you can control without swinging.']});
addVariant('barPushdown','ropePushdown','Straight-Bar Pushdown',{img:['Triceps_Pushdown','Reverse_Grip_Triceps_Pushdown'],yt:'straight bar triceps pushdown proper form'});
addVariant('machineTriceps','ropePushdown','Machine Triceps Extension',{img:['Machine_Triceps_Extension','Dips_-_Triceps_Version','Triceps_Pushdown'],yt:'triceps extension machine proper form'});
addVariant('cableCurl','preacherCurl','Cable Curl',{img:['Standing_Biceps_Cable_Curl','Cable_Hammer_Curls_-_Rope_Attachment'],yt:'standing cable biceps curl proper form',steps:['Set a straight or EZ attachment on a low pulley and stand tall.','Keep your elbows close to your sides and shoulders relaxed.','Curl the handle toward your upper chest without letting your elbows travel forward.','Lower slowly until your arms are fully extended.'],tips:['Do not rock your torso to move the weight.','Keep tension on the biceps at the bottom.']});
addVariant('machineCurl','preacherCurl','Machine Curl',{img:['Machine_Preacher_Curls','Preacher_Curl'],yt:'biceps curl machine proper form'});
addVariant('smithSquat','hackSquat','Smith Squat',{img:['Smith_Machine_Squat','Barbell_Squat'],yt:'smith machine squat proper form',steps:['Set the bar around upper-chest height and position it across your upper back.','Stand with your feet slightly in front of the bar path and brace your torso.','Sit down between your hips and knees as deep as you can while keeping your heels down.','Drive through the whole foot to stand tall without snapping your knees into lockout.'],tips:['Adjust foot position until your knees track comfortably over your toes.','Keep your upper back tight against the bar.']});
addVariant('dbRdl','rdl','Dumbbell Romanian Deadlift',{img:['Dumbbell_Stiff_Leg_Deadlift','Romanian_Deadlift'],yt:'dumbbell romanian deadlift proper form'});
addVariant('smithRdl','rdl','Smith Romanian Deadlift',{img:['Romanian_Deadlift','Stiff-Legged_Barbell_Deadlift'],yt:'smith machine romanian deadlift proper form'});
addVariant('cableLegCurl','seatedLegCurl','Single-Leg Cable Curl',{side:true,img:['Standing_Leg_Curl','Lying_Leg_Curls'],yt:'single leg cable hamstring curl proper form',steps:['Attach an ankle cuff to a low pulley and stand facing the stack with support nearby.','Keep your working thigh mostly fixed and your torso braced.','Curl your heel toward your glute by bending the knee.','Lower slowly until the leg is nearly straight, then finish the set before switching sides.'],tips:['Do not swing your thigh forward and back.','Use a full, controlled range rather than heavy weight.']});
addVariant('stepUp','reverseLunge','Step-Up',{side:true,img:['Dumbbell_Step_Ups','Barbell_Step_Ups'],yt:'dumbbell step up proper form',steps:['Choose a box around knee height or slightly lower and place your whole working foot on it.','Lean slightly forward and brace your torso.','Drive through the foot on the box to stand up without pushing hard off the trailing leg.','Lower under control and repeat all reps before switching sides.'],tips:['Keep the working knee tracking over the toes.','Use a lower box if your pelvis twists or you have to jump off the floor.']});
addVariant('legPressCalf','standingCalf','Leg Press Calf Raise',{img:['Calf_Press_On_The_Leg_Press_Machine','Calf_Press'],yt:'leg press calf raise proper form',steps:['Set up in the leg press and place the balls of your feet near the lower edge of the platform.','Keep your knees softly bent but fixed.','Lower your heels as far as comfortable for a deep calf stretch.','Push through the balls of your feet to rise as high as possible, then lower slowly.'],tips:['The ankle should move; the knees should not pump in and out.','Pause briefly in both the stretch and top position.']});
addVariant('smithCalf','standingCalf','Smith Calf Raise',{img:['Standing_Calf_Raises','Standing_Dumbbell_Calf_Raise'],yt:'smith machine standing calf raise proper form'});
addVariant('abCrunchMachine','cableCrunch','Ab Crunch Machine',{img:['Ab_Crunch_Machine','Crunches'],yt:'ab crunch machine proper form',steps:['Adjust the seat and pad so the machine rotates comfortably with your torso.','Brace your hips and start with your abs slightly stretched.','Curl your ribs toward your pelvis while exhaling.','Return slowly until your torso is extended without letting the stack slam down.'],tips:['Think about shortening the distance between ribs and pelvis.','Do not turn it into a hip hinge.']});
addVariant('declineCrunch','cableCrunch','Decline Crunch',{img:['Decline_Crunch','Crunches'],yt:'decline crunch proper form',steps:['Secure your legs on a mild decline bench and lie back with your hands across your chest or beside your head.','Brace your abs and gently tuck your pelvis.','Curl your ribs toward your pelvis until your shoulder blades lift clearly from the bench.','Lower under control until your abs are stretched again.'],tips:['Do not pull on your neck.','A small controlled range is better than sitting all the way upright.']});
addVariant('bandPullUp','pullUp','Band-Assisted Pull-Up',{assist:false,img:['Band_Assisted_Pull-Up','Pullups'],yt:'band assisted pull up proper form'});
addVariant('dbShoulder','machineShoulder','Dumbbell Shoulder Press',{img:['Dumbbell_Shoulder_Press','Arnold_Dumbbell_Press'],yt:'seated dumbbell shoulder press proper form',steps:['Sit with the bench nearly upright and hold the dumbbells around shoulder height.','Brace your torso and keep your forearms roughly vertical.','Press the dumbbells overhead until your arms are nearly straight.','Lower under control until your elbows are just below shoulder height.'],tips:['Do not turn the movement into a steep incline bench press.','Keep your ribs down instead of over-arching your lower back.']});
addVariant('smithShoulder','machineShoulder','Smith Shoulder Press',{img:['Smith_Machine_Behind_the_Neck_Press','Barbell_Shoulder_Press'],yt:'smith machine shoulder press proper form'});
addVariant('oneArmMachinePulldown','oneArmPulldown','One-Arm Machine Pulldown',{side:true,img:['One_Arm_Lat_Pulldown','Close-Grip_Front_Lat_Pulldown'],yt:'single arm machine lat pulldown proper form'});
addVariant('straightArmPulldown','oneArmPulldown','Straight-Arm Pulldown',{side:false,type:'isolation',img:['Straight-Arm_Pulldown','Straight_Arm_Pulldown'],yt:'straight arm cable pulldown proper form',steps:['Attach a straight bar or rope high and stand far enough back to start with your arms overhead.','Keep a small fixed bend in your elbows and brace your ribs down.','Sweep the handle down toward your thighs by driving your upper arms toward your sides.','Return slowly overhead until your lats are fully stretched.'],tips:['Your elbows stay nearly fixed; this is not a triceps pushdown.','Avoid turning the bottom into a torso swing.']});
addVariant('cableRearDelt','reversePecDeck','Cable Rear-Delt Fly',{img:['Cable_Rear_Delt_Fly','Reverse_Flyes','Reverse_Machine_Flyes'],yt:'cable rear delt fly proper form'});
addVariant('bentOverRearDelt','reversePecDeck','Bent-Over Dumbbell Rear-Delt Raise',{img:['Bent_Over_Dumbbell_Rear_Delt_Raise_With_Head_On_Bench','Reverse_Flyes'],yt:'bent over dumbbell rear delt raise proper form',steps:['Hinge forward with a flat back or support your chest on an incline bench.','Let the dumbbells hang below your shoulders with a small bend in the elbows.','Raise your arms out and slightly back until your upper arms are near shoulder level.','Lower slowly to the start without swinging.'],tips:['Use light dumbbells and keep your traps relaxed.','Think about moving the upper arm, not squeezing the shoulder blades hard.']});
addVariant('dbOverheadExt','overheadExt','Dumbbell Overhead Triceps Extension',{img:['Seated_Triceps_Press','Standing_Dumbbell_Triceps_Extension'],yt:'dumbbell overhead triceps extension proper form'});
addVariant('skullCrusher','overheadExt','Skull Crusher',{img:['EZ-Bar_Skullcrusher','Lying_Triceps_Press'],yt:'ez bar skull crusher proper form',steps:['Lie on a bench holding an EZ bar or dumbbells above your shoulders.','Keep your upper arms angled slightly back and mostly fixed.','Bend your elbows to lower the weight toward the top of your head or just behind it.','Extend your elbows to return without letting your shoulders take over.'],tips:['Keep your elbows from flaring excessively.','Use a controlled stretch and choose a load that is elbow-friendly.']});
addVariant('spiderCurl','preacherCurl','Dumbbell Spider Curl',{img:['Spider_Curl','Preacher_Curl'],yt:'dumbbell spider curl proper form',steps:['Set an incline bench around 45° and lie chest-down with your arms hanging toward the floor.','Turn your palms forward and keep your upper arms still.','Curl the dumbbells toward your shoulders and squeeze the biceps.','Lower fully and slowly until the elbows are straight.'],tips:['Keep your chest glued to the bench.','Do not swing the dumbbells out in front of you.']});
addVariant('gluteDrive','hipThrust','Glute Drive Machine',{img:['Barbell_Hip_Thrust','Barbell_Glute_Bridge'],yt:'glute drive machine proper form'});
addVariant('smithHipThrust','hipThrust','Smith Hip Thrust',{img:['Barbell_Hip_Thrust','Barbell_Glute_Bridge'],yt:'smith machine hip thrust proper form'});
addVariant('singleLegExtension','legExtension','Single-Leg Extension',{side:true,img:['Leg_Extensions'],yt:'single leg extension machine proper form'});
addVariant('assistedSissy','legExtension','Assisted Sissy Squat',{img:['Sissy_Squat','Bodyweight_Squat'],yt:'assisted sissy squat proper form',steps:['Hold a stable support with one or both hands and stand tall on the balls of your feet.','Keep your hips extended as your knees travel forward and your torso leans back as one line.','Descend only as far as your knees tolerate while keeping tension on the quads.','Drive through the forefoot and straighten your knees to return.'],tips:['Start with bodyweight and a short range.','Stop if the movement causes sharp knee pain.']});
addVariant('captainsKnee','hangingKneeRaise',"Captain's Chair Knee Raise",{img:['Knee_Hip_Raise_On_Parallel_Bars','Hanging_Leg_Raise'],yt:"captain's chair knee raise proper form",steps:['Place your forearms on the pads and press your back gently into the support.','Brace your core and let your legs hang without swinging.','Curl your pelvis up as you bring your knees toward your chest.','Lower slowly until your legs are extended again.'],tips:['Avoid using momentum.','Think about curling the pelvis rather than only lifting the thighs.']});
addVariant('reverseCrunch','hangingKneeRaise','Reverse Crunch',{img:['Reverse_Crunch','Flat_Bench_Lying_Leg_Raise'],yt:'reverse crunch proper form',steps:['Lie on your back with your hips and knees bent around 90° and your arms by your sides.','Brace your abs and gently flatten your lower back.','Curl your pelvis toward your ribs so your tailbone lifts slightly from the floor.','Lower slowly until your pelvis returns to the floor without letting your legs swing.'],tips:['The goal is pelvic curl, not throwing the knees toward your face.','Keep the movement small and controlled.']});

const GROUPS=['Chest','Back','Shoulders','Arms','Quads','Hamstrings','Glutes','Calves','Core'];

/* ---------- Program ---------- */
const DAYS=[
  {key:'sat',day:'Saturday',short:'Sat',dow:6,title:'Upper A',focus:'Upper Chest + Back Width + Core',items:[
    {ex:'inclineDb',sets:3,reps:[6,10],alts:['inclineMachinePress','inclineSmith']},
    {ex:'latPulldown',sets:3,reps:[8,12],alts:['pullUp','oneArmPulldown']},
    {ex:'chestRow',sets:3,reps:[8,12],alts:['seatedRow','machineRow']},
    {ex:'machineChest',sets:2,reps:[10,15],alts:['dbBench','cableChestPress']},
    {ex:'cableLateral',sets:3,reps:[12,20],alts:['dbLateral','lateralMachine']},
    {ex:'ropePushdown',sets:2,reps:[10,15],alts:['barPushdown','machineTriceps']},
    {ex:'inclineCurl',sets:2,reps:[10,15],alts:['cableCurl','machineCurl']},
    {ex:'cableCrunch',sets:3,reps:[10,15],alts:['abCrunchMachine','declineCrunch']}]},
  {key:'sun',day:'Sunday',short:'Sun',dow:0,title:'Lower A',focus:'Quads + Hamstrings',items:[
    {ex:'hackSquat',sets:3,reps:[6,10],alts:['legPress','smithSquat']},
    {ex:'rdl',sets:3,reps:[8,10],alts:['dbRdl','smithRdl']},
    {ex:'seatedLegCurl',sets:3,reps:[10,15],alts:['lyingLegCurl','cableLegCurl']},
    {ex:'bulgarian',sets:2,reps:[8,12],alts:['reverseLunge','stepUp']},
    {ex:'standingCalf',sets:3,reps:[10,15],alts:['legPressCalf','smithCalf']}]},
  {key:'tue',day:'Tuesday',short:'Tue',dow:2,title:'Upper B',focus:'Back Width + Shoulders + Upper Chest + Core',items:[
    {ex:'pullUp',sets:3,reps:[6,10],alts:['latPulldown','bandPullUp']},
    {ex:'machineShoulder',sets:3,reps:[6,10],alts:['dbShoulder','smithShoulder']},
    {ex:'oneArmPulldown',sets:3,reps:[10,15],alts:['oneArmMachinePulldown','straightArmPulldown']},
    {ex:'inclineMachinePress',sets:2,reps:[8,12],alts:['inclineDb','inclineSmith']},
    {ex:'reversePecDeck',sets:3,reps:[12,20],alts:['cableRearDelt','bentOverRearDelt']},
    {ex:'lateralMachine',sets:3,reps:[12,20],alts:['cableLateral','dbLateral']},
    {ex:'overheadExt',sets:3,reps:[10,15],alts:['dbOverheadExt','skullCrusher']},
    {ex:'preacherCurl',sets:3,reps:[10,15],alts:['cableCurl','spiderCurl']},
    {ex:'cableCrunch',sets:3,reps:[10,15],alts:['abCrunchMachine','declineCrunch']}]},
  {key:'thu',day:'Thursday',short:'Thu',dow:4,title:'Lower B',focus:'Glutes + Hamstrings + Leg Balance + Core',items:[
    {ex:'hipThrust',sets:3,reps:[8,12],alts:['gluteDrive','smithHipThrust']},
    {ex:'legPress',sets:3,reps:[10,15],alts:['hackSquat','smithSquat']},
    {ex:'lyingLegCurl',sets:3,reps:[10,15],alts:['seatedLegCurl','cableLegCurl']},
    {ex:'reverseLunge',sets:2,reps:[10,12],alts:['bulgarian','stepUp']},
    {ex:'legExtension',sets:2,reps:[12,15],alts:['singleLegExtension','assistedSissy']},
    {ex:'seatedCalf',sets:3,reps:[12,20],alts:['standingCalf','legPressCalf']},
    {ex:'hangingKneeRaise',sets:3,reps:[8,15],alts:['captainsKnee','reverseCrunch']}]}
]
const DAY=Object.fromEntries(DAYS.map(d=>[d.key,d]));
const slotKey=(day,i)=>`${day}:${i}`;
const optionsFor=it=>[it.ex,...(it.alts||[])];
function validOption(day,i,id){const d=DAY[day],it=d&&d.items[i];return !!(it&&typeof id==='string'&&optionsFor(it).includes(id)&&EX[id])}
const DN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const IMG='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';
const ID_RE=new RegExp('^\\d{4}-\\d{2}-\\d{2}_('+DAYS.map(d=>d.key).join('|')+')$');

/* ---------- Helpers ---------- */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const iso=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const parseISO=s=>new Date(s+'T00:00');
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const satStart=d=>{const x=new Date(d);x.setHours(0,0,0,0);x.setDate(x.getDate()-((x.getDay()+1)%7));return x};
const fmt=s=>{s=Math.max(0,Math.round(s||0));return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`};
const locale=()=>isFA()?'fa-IR':'en-US';
const fmtDate=s=>parseISO(s).toLocaleDateString(locale(),{month:'short',day:'numeric'});
const fmtInt=v=>Math.round(v||0).toLocaleString(locale());
const fmtK=v=>{v=Math.round(v||0);return v>=10000?Math.round(v/1000)+'k':v>=1000?(v/1000).toFixed(1).replace(/\.0$/,'')+'k':String(v)};
const fmtDur=m=>{m=Math.round(m||0);if(m<60)return m+'m';const h=Math.floor(m/60),r=m%60;return r?`${h}h ${r}m`:`${h}h`};
const tm=ts=>new Date(ts).toLocaleTimeString(locale(),{hour:'numeric',minute:'2-digit'});
const e1=(w,r)=>w>0&&r>0?w*(1+r/30):0;
const r1=v=>Math.round(v*10)/10;
/* Persian/Arabic digits and decimal comma → plain ASCII number string */
const normNum=v=>String(v??'')
  .replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
  .replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d))
  .replace(/[٫,]/g,'.').replace(/[^\d.]/g,'');
const num=v=>parseFloat(normNum(v))||0;
const haptic=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
let lsWarned=false;
const LS={
  get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){if(!lsWarned){lsWarned=true;setTimeout(()=>toast('Storage is full. Back up, then delete old history.'),0)}return false}}
};
function relDays(d){const n=Math.round((parseISO(iso())-parseISO(d))/864e5);return n<=0?'Today':n===1?'Yesterday':n+' days ago'}
function relTime(ts){const m=Math.round((Date.now()-ts)/60000);return m<1?'just now':m<60?m+' min ago':m<1440?Math.round(m/60)+' h ago':Math.round(m/1440)+' d ago'}
let toT;
function toast(m){const t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(toT);toT=setTimeout(()=>t.classList.remove('show'),2600)}
function ask(msg,okLabel='Confirm',danger=false){
  const d=$('#dlg');
  if(!d||!d.showModal)return Promise.resolve(confirm(msg));
  $('#dlgMsg').textContent=msg;const b=$('#dlgOk');b.textContent=okLabel;b.classList.toggle('dz',!!danger);
  d.returnValue='';d.showModal();
  return new Promise(res=>d.addEventListener('close',()=>res(d.returnValue==='ok'),{once:true}));
}

/* ---------- Sanitizers (everything from storage, backups and the server passes through these) ---------- */
const finite=v=>typeof v==='number'&&isFinite(v)?v:null;
function cleanW(x){
  if(!x||typeof x!=='object'||typeof x.id!=='string'||!ID_RE.test(x.id))return null;
  const items=(Array.isArray(x.items)?x.items:[]).filter(it=>it&&typeof it.ex==='string'&&EX[it.ex]).map(it=>({
    slot:typeof it.slot==='string'?it.slot:'',
    ex:it.ex,
    sets:(Array.isArray(it.sets)?it.sets:[]).slice(0,20).map(s=>({w:normNum(s&&s.w).slice(0,7),r:normNum(s&&s.r).slice(0,4),d:!!(s&&s.d),t:finite(s&&s.t)}))
  }));
  const w={id:x.id,v:3,day:x.id.slice(11),date:x.id.slice(0,10),startedAt:finite(x.startedAt),finishedAt:finite(x.finishedAt),items,abs:!!x.abs,bw:finite(x.bw)||75,durOverride:finite(x.durOverride),updatedAt:finite(x.updatedAt)||0};
  if(x.deleted)w.deleted=true;
  return w;
}
function cleanS(s){
  s=s&&typeof s==='object'?s:{};
  const n=(v,lo,hi,d)=>{if(v==null||v==='')return d;v=Number(v);return isFinite(v)?Math.min(hi,Math.max(lo,v)):d};
  const choices={};if(s.choices&&typeof s.choices==='object')Object.entries(s.choices).forEach(([k,v])=>{const m=/^(sat|sun|tue|thu):(\d+)$/.exec(k);if(m&&validOption(m[1],+m[2],v))choices[k]=v});
  return{unit:s.unit==='lb'?'lb':'kg',lang:s.lang==='fa'?'fa':'en',restC:n(s.restC,60,300,150),restI:n(s.restI,30,180,75),sound:s.sound!==false,wake:!!s.wake,bw:n(s.bw,30,250,75),choices,updatedAt:n(s.updatedAt,0,9e15,0)};
}

/* =====================================================================
   DATA LAYER — all reads and writes go through Store.
   Local-first: changes save to localStorage (debounced), then Sync
   pushes them to the server when CONFIG.server.enabled is true.
   ===================================================================== */
const hasActivity=w=>!!w.items.some(it=>it.sets.some(s=>s.d));
const Store={
  W:LS.get('mytraining.workouts',{}),
  S:cleanS(LS.get('mytraining.settings',{})),
  ver:0,dirty:new Set(),saveT:0,_l:null,_lv:-1,
  /* merge records from another source; newer updatedAt wins (ge: ties win too) */
  merge(obj,ge){
    let ch=false;
    Object.values(obj||{}).forEach(r=>{
      if(!r||typeof r.id!=='string')return;
      const l=this.W[r.id],ru=+r.updatedAt||0,lu=l?(l.updatedAt||0):-1;
      if(ge?ru>=lu:ru>lu){const c=cleanW(r);if(c){this.W[c.id]=c;ch=true}}
    });
    if(ch)this.ver++;
    return ch;
  },
  saveW(){this.merge(LS.get('mytraining.workouts',{}));LS.set('mytraining.workouts',this.W)}, // merge first so another tab's edits aren't overwritten
  saveS(){this.S.updatedAt=Date.now();this.ver++;LS.set('mytraining.settings',this.S);Sync.queue('settings',this.S)},
  get(id){const w=this.W[id];return w&&!w.deleted?w:null},
  list(){
    if(this._lv!==this.ver){
      this._l=Object.values(this.W).filter(w=>!w.deleted&&hasActivity(w)).sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:(a.startedAt||0)-(b.startedAt||0));
      this._lv=this.ver;
    }
    return this._l;
  },
  ensure(day,date=activeDate(day)){
    const id=`${date}_${day}`,plan=DAY[day].items;let w=this.W[id];
    if(!w||w.deleted){w=this.W[id]={id,v:3,day,date,startedAt:null,finishedAt:null,items:[],abs:false,bw:this.S.bw,durOverride:null,updatedAt:Date.now()};this.ver++}
    /* Each program slot can use one of three exercises. Keep the slot stable,
       while storing the actual selected exercise so each option has separate history. */
    const pool=w.items.slice();
    w.items=plan.map((p,i)=>{
      const slot=slotKey(day,i),opts=optionsFor(p),preferred=validOption(day,i,this.S.choices&&this.S.choices[slot])?this.S.choices[slot]:p.ex;
      let k=pool.findIndex(x=>x.slot===slot);
      if(k<0)k=pool.findIndex(x=>opts.includes(x.ex)); // migration from v2 records
      const x=k>=0?pool.splice(k,1)[0]:{slot,ex:preferred,sets:[]};
      x.slot=slot;if(!opts.includes(x.ex)||!EX[x.ex])x.ex=preferred;
      return x;
    });
    plan.forEach((p,i)=>{const x=w.items[i];while(x.sets.length<p.sets)x.sets.push({w:'',r:'',d:false,t:null});if(x.sets.length>p.sets)x.sets=x.sets.slice(0,p.sets)});
    w.v=3;
    return w;
  },
  touch(w,now){
    w.updatedAt=Date.now();this.ver++;this.dirty.add(w.id);
    clearTimeout(this.saveT);
    if(now)this.flush();else this.saveT=setTimeout(()=>this.flush(),400);
  },
  flush(){
    clearTimeout(this.saveT);
    if(!this.dirty.size)return;
    this.saveW();
    this.dirty.forEach(id=>{const w=this.W[id];if(w)Sync.queue(w.deleted?'delete':'put',w)});
    this.dirty.clear();
  },
  remove(id){const w=this.W[id];if(!w)return;w.deleted=true;this.touch(w,true)}
};
const S=Store.S;


/* ---------- Bilingual UI: English / Persian ---------- */
const FA_EX={
  'Incline Smith Press':'پرس بالاسینه اسمیت','Chest-Supported Row':'روئینگ با تکیه‌گاه سینه','Neutral-Grip Lat Pulldown':'لت پول‌داون دست خنثی','Machine Chest Press':'پرس سینه دستگاه','Cable Lateral Raise':'نشر جانب سیم‌کش','Reverse Pec Deck':'فلای معکوس دستگاه','Rope Triceps Pushdown':'پشت بازو طناب','Incline Dumbbell Curl':'جلو بازو دمبل روی میز شیب‌دار','Hack Squat':'هاک اسکوات','Romanian Deadlift':'ددلیفت رومانیایی','Bulgarian Split Squat':'اسپلیت اسکوات بلغاری','Seated Leg Curl':'پشت پا نشسته','Standing Calf Raise':'ساق پا ایستاده','Assisted Pull-Up':'بارفیکس کمکی','Flat Dumbbell Bench Press':'پرس سینه دمبل تخت','Seated Cable Row':'قایقی سیم‌کش نشسته','Machine Shoulder Press':'پرس سرشانه دستگاه','Low-to-High Cable Fly':'فلای سیم‌کش پایین به بالا','Rear-Delt Cable Fly / Reverse Pec Deck':'فلای پشت سرشانه سیم‌کش / پک‌دک معکوس','Overhead Cable Triceps Extension':'پشت بازو سیم‌کش بالای سر','Preacher Curl':'جلو بازو لاری','Hip Thrust':'هیپ تراست','Leg Press':'پرس پا','Lying Leg Curl':'پشت پا خوابیده','45° Back Extension':'بک اکستنشن ۴۵ درجه','Incline Dumbbell Press':'پرس بالاسینه دمبل','One-Arm Cable Lat Pulldown':'لت سیم‌کش تک‌دست','Incline Machine Chest Press':'پرس بالاسینه دستگاه','Lateral Raise Machine':'نشر جانب دستگاه','Cable Crunch':'کرانچ سیم‌کش','Reverse Lunge':'لانج معکوس','Leg Extension':'جلو پا دستگاه','Hanging Knee Raise':'بالا آوردن زانو آویزان','Seated Calf Raise':'ساق پا نشسته',
  'Machine Row':'روئینگ دستگاه','Cable Chest Press':'پرس سینه سیم‌کش','Dumbbell Lateral Raise':'نشر جانب دمبل','Straight-Bar Pushdown':'پشت بازو سیم‌کش با میله صاف','Machine Triceps Extension':'پشت بازو دستگاه','Cable Curl':'جلو بازو سیم‌کش','Machine Curl':'جلو بازو دستگاه','Smith Squat':'اسکوات اسمیت','Dumbbell Romanian Deadlift':'ددلیفت رومانیایی دمبل','Smith Romanian Deadlift':'ددلیفت رومانیایی اسمیت','Single-Leg Cable Curl':'پشت پا تک‌پا سیم‌کش','Step-Up':'استپ‌آپ','Leg Press Calf Raise':'ساق پا روی پرس پا','Smith Calf Raise':'ساق پا اسمیت','Ab Crunch Machine':'کرانچ شکم دستگاه','Decline Crunch':'کرانچ روی میز شیب‌دار','Band-Assisted Pull-Up':'بارفیکس با کمک کش','Dumbbell Shoulder Press':'پرس سرشانه دمبل','Smith Shoulder Press':'پرس سرشانه اسمیت','One-Arm Machine Pulldown':'لت دستگاه تک‌دست','Straight-Arm Pulldown':'پول‌داون دست صاف','Cable Rear-Delt Fly':'فلای پشت سرشانه سیم‌کش','Bent-Over Dumbbell Rear-Delt Raise':'نشر خم دمبل','Dumbbell Overhead Triceps Extension':'پشت بازو دمبل بالای سر','Skull Crusher':'اسکال کراشر','Dumbbell Spider Curl':'جلو بازو اسپایدر دمبل','Glute Drive Machine':'گلوت درایو دستگاه','Smith Hip Thrust':'هیپ تراست اسمیت','Single-Leg Extension':'جلو پا تک‌پا','Assisted Sissy Squat':'سیسی اسکوات کمکی',"Captain's Chair Knee Raise":'بالا آوردن زانو روی کاپیتان‌چیر','Reverse Crunch':'کرانچ معکوس'
};
const FA_EXACT={
  'My Training':'تمرین من','Program':'برنامه','History':'تاریخچه','Settings':'تنظیمات','Preferences':'تنظیمات','Back':'بازگشت','Close':'بستن','Cancel':'لغو','OK':'تأیید','Confirm':'تأیید','Rest':'استراحت','Start':'شروع','Finish':'پایان','Today':'امروز','Done':'انجام‌شده','Next':'بعدی','Previous':'قبلی','Up next':'حرکت بعدی','MAIN':'اصلی','ALT 1':'جایگزین ۱','ALT 2':'جایگزین ۲','ALT':'جایگزین','Technique':'تکنیک','Log sets':'ثبت ست‌ها','Sets':'ست‌ها','Reps':'تکرار','Weight':'وزنه','Assist':'کمک','Effort':'شدت','Last set':'ست آخر','Compound':'چندمفصلی','Isolation':'تک‌مفصلی','Exercises':'حرکت‌ها','Minutes':'دقیقه','Workouts':'تمرین‌ها','Time':'زمان','This week':'این هفته','Execution rules':'قواعد اجرا','Effort, rest and progression':'شدت، استراحت و پیشرفت','Rules':'قواعد','Reset today':'پاک کردن امروز','Exercise history':'تاریخچه حرکت','Previous sessions':'جلسات قبلی','Full history and progress chart':'تاریخچه کامل و نمودار پیشرفت','How to do it':'روش اجرا','Form tips':'نکات فرم','Choose exercise':'انتخاب حرکت','Watch tutorial on YouTube':'دیدن آموزش در یوتیوب','Loading demo':'در حال بارگذاری','Image unavailable — watch the tutorial below':'تصویر موجود نیست — آموزش پایین را ببین','Pause animation':'توقف انیمیشن','Play animation':'پخش انیمیشن','Body weight':'وزن بدن','Weight unit':'واحد وزن','Compound rest':'استراحت حرکات چندمفصلی','Isolation rest':'استراحت حرکات تک‌مفصلی','Timer sound':'صدای تایمر','Keep screen awake':'روشن نگه داشتن صفحه','Cloud sync':'همگام‌سازی ابری','Sync now':'همگام‌سازی','Connect':'اتصال','Setup':'راه‌اندازی','Back up':'پشتیبان‌گیری','Restore':'بازیابی','Delete all workout history':'حذف کل تاریخچه تمرین','Delete workout':'حذف تمرین','Save':'ذخیره','Duration':'مدت','Volume':'حجم تمرین','Calories (est.)':'کالری تخمینی','Sessions':'جلسات','Last trained':'آخرین تمرین','Progress':'پیشرفت','All sessions':'همه جلسات','Heaviest set':'سنگین‌ترین ست','Best effective load':'بهترین بار مؤثر','Best est. 1RM':'بهترین 1RM تخمینی','Exercise':'حرکت','Skipped':'رد شده','Workout':'تمرین','Workout complete':'تمرین کامل شد','Open workout':'باز کردن تمرین','Continue workout':'ادامه تمرین','Start workout':'شروع تمرین','Finish workout':'پایان تمرین','View summary':'مشاهده خلاصه','Rest day':'روز استراحت','Recover well.':'خوب ریکاوری کن.','Core training':'تمرین شکم','Progression':'پیشرفت','What RIR means':'معنی RIR','Private sync code':'کد خصوصی همگام‌سازی','Connect this device':'اتصال این دستگاه','Disconnect device':'قطع اتصال دستگاه','Cloud sync is enabled on this device':'همگام‌سازی ابری روی این دستگاه فعال است','Cloud setup needed':'راه‌اندازی Cloud لازم است','Duration in minutes':'مدت به دقیقه','Decrease':'کاهش','Increase':'افزایش','Dismiss timer':'بستن تایمر','Subtract 15 seconds':'۱۵ ثانیه کم کن','Add 15 seconds':'۱۵ ثانیه اضافه کن',
  'Chest':'سینه','Upper chest':'بالاسینه','Front delts':'سرشانه جلویی','Triceps':'پشت بازو','Mid back':'میان‌پشت','Lats':'لت','Rear delts':'سرشانه خلفی','Biceps':'جلو بازو','Upper back':'بالای پشت','Shoulders':'سرشانه','Arms':'بازو','Quads':'چهارسر ران','Hamstrings':'پشت ران','Glutes':'باسن','Calves':'ساق','Core':'شکم و میان‌تنه','Abs':'شکم','Chest, shoulders':'سینه، سرشانه'
};
const FA_REPLACE={
  'Upper Chest + Back Width + Core':'بالاسینه + عرض پشت + شکم','Quads + Hamstrings':'چهارسر ران + پشت ران','Back Width + Shoulders + Upper Chest + Core':'عرض پشت + سرشانه + بالاسینه + شکم','Glutes + Hamstrings + Leg Balance + Core':'باسن + پشت ران + تعادل پا + شکم',
  'Saturday':'شنبه','Sunday':'یکشنبه','Tuesday':'سه‌شنبه','Thursday':'پنجشنبه','Monday':'دوشنبه','Wednesday':'چهارشنبه','Friday':'جمعه','Sat':'ش','Sun':'ی','Tue':'س','Thu':'پ','Mon':'د','Wed':'چ','Fri':'ج',
  'Upper A':'بالاتنه A','Upper B':'بالاتنه B','Lower A':'پایین‌تنه A','Lower B':'پایین‌تنه B',
  'All sets done. Tap Finish workout to save it.':'همه ست‌ها انجام شدند. برای ذخیره، پایان تمرین را بزن.','Log at least one set first':'اول حداقل یک ست ثبت کن','Backup downloaded':'فایل پشتیبان دانلود شد','Backup restored':'پشتیبان بازیابی شد','Workout deleted':'تمرین حذف شد','History deleted':'تاریخچه حذف شد',"Today's log cleared":'ثبت‌های امروز پاک شد','Nothing logged today':'امروز چیزی ثبت نشده','Rest over. Next set.':'استراحت تمام شد. ست بعدی.','First time logging this one. Your numbers will show as hints next session.':'اولین بار است این حرکت را ثبت می‌کنی. جلسه بعد اعدادت به‌عنوان راهنما نمایش داده می‌شوند.','Choose the version available in your gym. Weight, reps and progress history are tracked separately for each option.':'نسخه‌ای را انتخاب کن که در باشگاهت در دسترس است. وزن، تکرار و تاریخچه پیشرفت هر گزینه جداگانه ثبت می‌شود.','Earlier sets stop short of failure; only the last set can reach 0–1 reps in reserve.':'ست‌های اول را قبل از ناتوانی متوقف کن؛ فقط ست آخر می‌تواند به ۰–۱ تکرار ذخیره برسد.',"Stop with 1–2 reps in reserve. Don't regularly take heavy compound lifts to complete failure.":'با ۱–۲ تکرار ذخیره متوقف شو. حرکات سنگین چندمفصلی را مرتب تا ناتوانی کامل نبر.','Enter the assistance weight. Leave it empty for bodyweight. Less assistance counts as progress.':'مقدار کمک دستگاه را وارد کن. برای وزن بدن خالی بگذار. کمک کمتر یعنی پیشرفت.','Workout history stays local too. Disconnecting only removes this device\'s saved code; it does not delete cloud data.':'تاریخچه روی دستگاه هم باقی می‌ماند. قطع اتصال فقط کد ذخیره‌شده این دستگاه را حذف می‌کند و داده Cloud پاک نمی‌شود.','Enter the same private sync code on your phone and computer. No email or account is needed.':'همان کد خصوصی همگام‌سازی را در موبایل و کامپیوتر وارد کن. ایمیل یا حساب کاربری لازم نیست.','The code is saved only in this browser. Keep it private.':'کد فقط در همین مرورگر ذخیره می‌شود. آن را خصوصی نگه دار.','Use the same code on your other device.':'همین کد را روی دستگاه دیگر هم وارد کن.','Beep when rest is over':'پایان استراحت بوق بزند','Stops your phone dimming mid-workout':'هنگام تمرین صفحه موبایل خاموش نمی‌شود','Not supported in this browser':'این مرورگر پشتیبانی نمی‌کند','Used for calories and assisted-exercise load':'برای محاسبه کالری و بار حرکات کمکی استفاده می‌شود',"Label only, numbers aren't converted":'فقط برچسب واحد عوض می‌شود؛ اعداد تبدیل نمی‌شوند','Plan: 2–3 min':'برنامه: ۲–۳ دقیقه','Plan: 60–90 s':'برنامه: ۶۰–۹۰ ثانیه','Your training':'تمرین‌های تو','Workout complete':'تمرین کامل شد','In progress':'در حال تمرین','Open workout':'باز کردن تمرین','Continue workout':'ادامه تمرین','Review ':'مرور ','Preview ':'پیش‌نمایش ','Continue: ':'ادامه: ','Next up: ':'بعدی: ','tomorrow':'فردا','on ':'در ','Rest · next exercise':'استراحت · حرکت بعدی','Rest · then set ':'استراحت · سپس ست ','Rest · ':'استراحت · ','New PR · ':'رکورد جدید · ',' complete':' کامل شد',' selected':' انتخاب شد',' waiting to sync':' منتظر همگام‌سازی','Last synced ':'آخرین همگام‌سازی ','Sync code saved on this device':'کد همگام‌سازی روی این دستگاه ذخیره شده','This device is not connected yet.':'این دستگاه هنوز متصل نیست.','Cloud setup is not finished yet.':'راه‌اندازی Cloud هنوز کامل نشده.','Could not connect — check the sync code or internet.':'اتصال برقرار نشد؛ کد همگام‌سازی یا اینترنت را بررسی کن.'
};
Object.assign(FA_REPLACE,FA_EX);
const FA_KEYS=Object.keys(FA_REPLACE).sort((a,b)=>b.length-a.length);
function isFA(){return S.lang==='fa'}
function trText(raw){
  if(!isFA()||raw==null)return String(raw??'');
  const s=String(raw),lead=(s.match(/^\s*/)||[''])[0],tail=(s.match(/\s*$/)||[''])[0];let x=s.trim();
  if(!x)return s;
  if(FA_EXACT[x])x=FA_EXACT[x];
  else{
    for(const k of FA_KEYS)if(x.includes(k))x=x.split(k).join(FA_REPLACE[k]);
    x=x.replace(/^Exercise (\d+) of (\d+)/,(_,a,b)=>`حرکت ${a} از ${b}`)
      .replace(/(\d+) exercises\b/g,'$1 حرکت').replace(/(\d+) sets\b/g,'$1 ست').replace(/~?(\d+) min\b/g,'~$1 دقیقه')
      .replace(/(\d+) days ago/g,'$1 روز پیش').replace(/(\d+) d ago/g,'$1 روز پیش').replace(/(\d+) h ago/g,'$1 ساعت پیش').replace(/(\d+) min ago/g,'$1 دقیقه پیش')
      .replace(/^Today$/,'امروز').replace(/^Yesterday$/,'دیروز').replace(/^just now$/,'همین الان')
      .replace(/^Set (\d+) reps$/,'تکرارهای ست $1').replace(/^Mark set (\d+) done$/,'علامت‌زدن ست $1 به‌عنوان انجام‌شده');
  }
  return lead+x+tail;
}
function translateNode(root){
  if(!isFA()||!root)return;
  const els=[];if(root.nodeType===1)els.push(root);if(root.querySelectorAll)els.push(...root.querySelectorAll('*'));
  for(const el of els){
    if(['SCRIPT','STYLE'].includes(el.tagName))continue;
    for(const a of ['aria-label','title','placeholder'])if(el.hasAttribute&&el.hasAttribute(a))el.setAttribute(a,trText(el.getAttribute(a)));
  }
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
  while(n=w.nextNode()){
    const p=n.parentElement;if(!p||['SCRIPT','STYLE','TEXTAREA','OPTION'].includes(p.tagName))continue;
    const t=trText(n.nodeValue);if(t!==n.nodeValue)n.nodeValue=t;
  }
}
function applyLanguage(){
  const fa=isFA();document.documentElement.lang=fa?'fa':'en';document.documentElement.dir=fa?'rtl':'ltr';document.body.classList.toggle('lang-fa',fa);
  const lb=document.getElementById('langBtn');if(lb){lb.textContent=fa?'EN':'FA';lb.setAttribute('aria-label',fa?'Switch to English':'تغییر زبان به فارسی')}
  if(fa)translateNode(document.body);
}
const langObserver=new MutationObserver(ms=>{if(!isFA())return;for(const m of ms){for(const n of m.addedNodes)if(n.nodeType===1||n.nodeType===3)translateNode(n.nodeType===3?n.parentElement:n);if(m.type==='characterData')translateNode(m.target.parentElement)}});
langObserver.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
(()=>{const raw=Store.W;Store.W={};for(const k in raw){const c=cleanW(raw[k]);if(c)Store.W[c.id]=c}})();

const Sync={
  q:[],last:LS.get('mytraining.lastSync',0),busy:false,timer:0,backoff:0,status:'idle',
  get configured(){return !!(CONFIG.server.enabled&&/^https:\/\//.test(CONFIG.server.baseUrl)&&!CONFIG.server.baseUrl.includes('YOUR_PROJECT_REF')&&!!CONFIG.server.publicKey&&!CONFIG.server.publicKey.includes('YOUR_SUPABASE_PUBLISHABLE_KEY'))},
  get on(){return this.configured&&!!this.token()},
  token(){return LS.get('mytraining.token','')||''},
  load(){
    const q=LS.get('mytraining.outbox',[]);let fix=false;
    this.q=(Array.isArray(q)?q:[]).filter(x=>x&&x.key).map((x,k)=>{if(!x.id){x.id='o'+Date.now()+k;fix=true}return x});
    if(fix)LS.set('mytraining.outbox',this.q);
  },
  queue(type,obj){
    if(!this.on)return;
    const key=type==='settings'?'settings':obj.id;
    this.q=LS.get('mytraining.outbox',[]).filter(x=>x.key!==key);
    this.q.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),key,type,body:JSON.parse(JSON.stringify(obj))});
    LS.set('mytraining.outbox',this.q);
    this.schedule(1200);
  },
  schedule(ms){clearTimeout(this.timer);this.timer=setTimeout(()=>this.flush(),ms)},
  async req(method,path,body,tokenOverride){
    const t=tokenOverride||this.token();
    const headers={'Content-Type':'application/json','apikey':CONFIG.server.publicKey};
    if(t)headers.Authorization='Bearer '+t;
    const res=await fetch(CONFIG.server.baseUrl.replace(/\/$/,'')+path,{method,headers,body:body?JSON.stringify(body):undefined});
    if(!res.ok){let detail='';try{const d=await res.json();detail=d&&d.error?String(d.error):''}catch(e){}const err=new Error(detail||('HTTP '+res.status));err.status=res.status;throw err}
    return res.status===204?null:res.json().catch(()=>null);
  },
  async connect(code){
    if(!this.configured)throw new Error('Cloud setup is incomplete. Check cloud-config.js.');
    if(!code||!code.trim())throw new Error('Paste your private sync code first.');
    const candidate=code.trim();
    // Validate the code before saving it on this device.
    const data=await this.req('GET','/workouts?since=0',undefined,candidate);
    if(!data||!Array.isArray(data.workouts))throw new Error('The server response was unexpected.');
    if(!LS.set('mytraining.token',candidate))throw new Error('Could not save the code in this browser.');
    this.status='connected';LS.set('mytraining.pullSince',0);
    const pulled=await this.pull(true);
    if(!pulled){LS.set('mytraining.token','');throw new Error('The code was accepted, but cloud data could not be downloaded. Check the internet and try again.');}
    // Merge remote data first, then upload the combined local history. The server
    // rejects older payload versions so a stale device cannot overwrite newer data.
    this.seed();
    await this.flush();
    return true;
  },
  async flush(){
    if(!this.on||this.busy||!navigator.onLine)return;
    this.busy=true;this.status='syncing';
    try{
      for(;;){
        this.q=LS.get('mytraining.outbox',[]);
        const op=this.q[0];if(!op)break;
        try{
          if(op.type==='put')await this.req('PUT','/workouts/'+encodeURIComponent(op.key),op.body);
          else if(op.type==='delete')await this.req('DELETE','/workouts/'+encodeURIComponent(op.key));
          else await this.req('PUT','/settings',op.body);
        }catch(e){
          // Preserve queued data on every failure; configuration errors must not erase workouts.
          throw e;
        }
        this.q=LS.get('mytraining.outbox',[]).filter(x=>x.id!==op.id); // remove by id, never by position
        if(!LS.set('mytraining.outbox',this.q))break;
      }
      this.backoff=0;this.last=Date.now();LS.set('mytraining.lastSync',this.last);this.status='connected';
    }catch(e){
      this.backoff=Math.min(300000,(this.backoff||2500)*2);
      this.status='error';console.warn('Sync failed; queued data is preserved. Retrying in',this.backoff/1000,'s',e);
      this.schedule(this.backoff);
    }finally{this.busy=false}
  },
  async pull(forceAll=false){
    if(!this.on||!navigator.onLine)return false;
    try{
      const since=forceAll?0:LS.get('mytraining.pullSince',0);
      const data=await this.req('GET','/workouts?since='+encodeURIComponent(since));
      const list=Array.isArray(data)?data:(data&&data.workouts)||[];
      let changed=Store.merge(list);
      if(data&&data.settings&&(+data.settings.updatedAt||0)>(S.updatedAt||0)){Object.assign(S,cleanS(Object.assign({},S,data.settings)));LS.set('mytraining.settings',S);Store.ver++;changed=true}
      /* Server cursor overlaps by five minutes to tolerate clock skew. */
      const cursor=data&&(data.cursor!=null?data.cursor:data.serverTime);
      LS.set('mytraining.pullSince',cursor!=null?cursor:Math.max(0,Date.now()-5*60000));
      this.last=Date.now();LS.set('mytraining.lastSync',this.last);this.status='connected';
      if(changed){Store.saveW();refreshBase()}
      return true;
    }catch(e){this.status='error';console.warn('Pull failed',e);return false}
  },
  seed(){ // Upload the merged local history after first pulling remote records.
    if(!this.on)return;
    Object.values(Store.W).forEach(w=>{if(hasActivity(w)||w.deleted)this.queue(w.deleted?'delete':'put',w)});
    this.queue('settings',S);
  }
};
Sync.load();

function migrateLegacy(log,abs){
  Object.entries(log||{}).forEach(([exId,arr])=>(Array.isArray(arr)?arr:[]).forEach(e=>{
    if(!e||!DAY[e.day]||typeof e.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(e.date))return;
    const d=DAY[e.day],i=d.items.findIndex(it=>it.ex===exId);if(i<0)return;
    const w=Store.ensure(e.day,e.date);
    (e.sets||[]).forEach((s,j)=>{if(s&&w.items[i].sets[j])Object.assign(w.items[i].sets[j],{w:normNum(s.w),r:normNum(s.r),d:!!s.d})});
  }));
  Object.keys(abs||{}).forEach(k=>{const[date,day]=k.split(':');if(DAY[day]&&/^\d{4}-\d{2}-\d{2}$/.test(date)&&abs[k])Store.ensure(day,date).abs=true});
  Store.ver++;Store.saveW();
}
/* No gp.* migration here: this site may share an origin with another training app. */

/* Purge old tombstones and empty abandoned workouts */
(()=>{
  const cut=Date.now()-CONFIG.tombstoneDays*864e5,old=iso(addDays(new Date(),-2)),pend=new Set(Sync.q.map(x=>x.key));let n=0;
  for(const id in Store.W){
    const w=Store.W[id];if(pend.has(id))continue;
    if((w.deleted&&(w.updatedAt||0)<cut)||(!w.deleted&&!hasActivity(w)&&w.date<old)){delete Store.W[id];n++}
  }
  if(n){Store.ver++;LS.set('mytraining.workouts',Store.W)}
})();

/* ---------- Domain logic ---------- */
/* An unfinished workout started late keeps its date past midnight */
function activeDate(day){
  const y=iso(addDays(new Date(),-1)),w=Store.get(`${y}_${day}`);
  return w&&w.startedAt&&!w.finishedAt&&Date.now()-w.startedAt<CONFIG.overnightHours*36e5?y:iso();
}
const todayId=day=>`${activeDate(day)}_${day}`;
const todayW=day=>Store.get(todayId(day));
function itemFor(w,plan,i){const slot=slotKey(w.day,i),x=w.items[i];return x&&x.slot===slot?x:(w.items.find(y=>y.slot===slot)||w.items.find(y=>optionsFor(plan[i]).includes(y.ex))||null)}
function session(day,i,create){const w=create?Store.ensure(day):todayW(day);return w?itemFor(w,DAY[day].items,i):null}
function selectedEx(day,i){const it=DAY[day].items[i],s=session(day,i);if(s&&validOption(day,i,s.ex))return s.ex;const c=S.choices&&S.choices[slotKey(day,i)];return validOption(day,i,c)?c:it.ex}
const repsTxt=it=>`${it.reps[0]}–${it.reps[1]}`;
const sideKind=ex=>ex&&ex.side?(['Back','Chest','Shoulders','Arms'].includes(ex.group)?'side':'leg'):'';
const isComp=(it,exId)=>EX[exId||it.ex].type==='compound';
const restFor=(it,exId)=>isComp(it,exId)?S.restC:S.restI;
const setTxt=(s,ex)=>(s.w?(ex&&ex.assist?'−':'')+esc(s.w)+'×':'')+(esc(s.r)||'–');
const bwU=kg=>S.unit==='kg'?kg:kg*2.20462;
/* effective load: for assisted movements it's bodyweight minus assistance */
const load=(ex,w,bw)=>{const W=num(w);return ex&&ex.assist?Math.max(0,bwU(bw||S.bw)-W):W};
function topTxt(ex,top){
  if(!top)return '';
  if(ex.assist)return top.W?`${r1(top.W)} ${S.unit} assist × ${top.R}`:`Bodyweight × ${top.R}`;
  return top.W?`${r1(top.W)} ${S.unit} × ${top.R}`:'';
}
function doneCount(key,i){const s=session(key,i);return s?s.sets.slice(0,DAY[key].items[i].sets).filter(x=>x.d).length:0}
function dayProgress(key){let done=0,total=0;DAY[key].items.forEach((it,i)=>{total+=it.sets;done+=doneCount(key,i)});return{done,total}}
function nextIdx(key){const its=DAY[key].items;for(let i=0;i<its.length;i++)if(doneCount(key,i)<its[i].sets)return i;return -1}
function estMin(key){let sec=0;DAY[key].items.forEach((it,i)=>{const exId=selectedEx(key,i);sec+=it.sets*((EX[exId].side?90:45)+restFor(it,exId))});return Math.max(5,Math.round(sec/300)*5)}
function weekRange(){const s=satStart(new Date());return[iso(s),iso(addDays(s,6))]}
function weekDone(key){
  const[ws,we]=weekRange(),plan=DAY[key].items;let done=0;
  Store.list().forEach(w=>{
    if(w.day!==key||w.date<ws||w.date>we)return;
    done=Math.max(done,plan.reduce((a,p,i)=>{const it=itemFor(w,plan,i);return a+(it?it.sets.slice(0,p.sets).filter(s=>s.d).length:0)},0));
  });
  return{done,total:plan.reduce((a,it)=>a+it.sets,0)};
}
function doneKeysByWeek(){const m={};Store.list().forEach(w=>{const k=iso(satStart(parseISO(w.date)));(m[k]=m[k]||new Set()).add(w.day)});return m}
function wStats(w){
  let sets=0,vol=0;const ts=[],groups={};
  w.items.forEach(it=>{const ex=EX[it.ex];it.sets.forEach(s=>{if(!s.d)return;sets++;vol+=load(ex,s.w,w.bw)*num(s.r)*(ex&&ex.side?2:1);if(s.t)ts.push(s.t);if(ex)groups[ex.group]=(groups[ex.group]||0)+1})});
  let dur;
  if(w.durOverride!=null)dur=w.durOverride;
  else{
    const start=w.startedAt||(ts.length?Math.min(...ts)-60000:0);
    if(start&&w.finishedAt)dur=(w.finishedAt-start)/60000;
    else if(start&&ts.length)dur=(Math.max(...ts)-start)/60000+2;
    else dur=sets*2.6;
  }
  dur=Math.round(Math.max(0,Math.min(CONFIG.maxSessionMin,dur)));
  const kcal=Math.round((dur*CONFIG.met.lifting)*(w.bw||S.bw)/60);
  return{sets,vol:Math.round(vol),dur,kcal,groups};
}
const XH=new Map();let xhv=-1;
function exHistory(exId,excludeId){
  if(xhv!==Store.ver){XH.clear();xhv=Store.ver}
  const key=exId+'|'+(excludeId||'');
  if(XH.has(key))return XH.get(key);
  const ex=EX[exId],out=[];
  Store.list().forEach(wk=>{if(wk.id===excludeId)return;wk.items.forEach(it=>{
    if(it.ex!==exId)return;const ds=it.sets.filter(s=>s.d);if(!ds.length)return;
    let top=null,best=0;
    ds.forEach(s=>{const W=num(s.w),R=num(s.r),L=load(ex,s.w,wk.bw);best=Math.max(best,e1(L,R));if(!top||L>top.L||(L===top.L&&R>top.R))top={W,R,L}});
    out.push({wk,sets:ds,top,e1:best});
  })});
  XH.set(key,out);
  return out;
}

/* ---------- Analytics ---------- */
const RANGES=['week','month','year'];
function period(range,off){
  const today=new Date();today.setHours(0,0,0,0);
  let s,e,label;const buckets=[];
  const dayB=d=>({s:iso(d),e:iso(d),cap:d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})});
  if(range==='week'){
    s=addDays(satStart(today),7*off);e=addDays(s,6);
    for(let k=0;k<7;k++){const d=addDays(s,k);buckets.push(Object.assign(dayB(d),{lbl:DN[d.getDay()]}))}
    const same=s.getMonth()===e.getMonth();
    label=`${s.toLocaleDateString('en-US',{month:'short',day:'numeric'})} – ${e.toLocaleDateString('en-US',same?{day:'numeric'}:{month:'short',day:'numeric'})}, ${e.getFullYear()}`;
  }else if(range==='month'){
    s=new Date(today.getFullYear(),today.getMonth()+off,1);e=new Date(s.getFullYear(),s.getMonth()+1,0);
    for(let d=new Date(s);d<=e;d=addDays(d,1))buckets.push(Object.assign(dayB(d),{lbl:[1,8,15,22,29].includes(d.getDate())?String(d.getDate()):''}));
    label=s.toLocaleDateString('en-US',{month:'long',year:'numeric'});
  }else{
    s=new Date(today.getFullYear()+off,0,1);e=new Date(s.getFullYear(),11,31);
    for(let m=0;m<12;m++){const ms=new Date(s.getFullYear(),m,1),me=new Date(s.getFullYear(),m+1,0);buckets.push({s:iso(ms),e:iso(me),lbl:ms.toLocaleDateString('en-US',{month:'narrow'}),cap:ms.toLocaleDateString('en-US',{month:'long',year:'numeric'})})}
    label=String(s.getFullYear());
  }
  const eyebrow=off===0?`This ${range}`:off===-1?`Last ${range}`:`${-off} ${range}s ago`;
  return{range,off,s,e,si:iso(s),ei:iso(e),buckets,label,eyebrow,today};
}
function plannedIn(p){const out=[],end=p.e<p.today?p.e:p.today;for(let d=new Date(p.s);d<=end;d=addDays(d,1)){const t=DAYS.find(x=>x.dow===d.getDay());if(t)out.push({date:iso(d),key:t.key,d:new Date(d)})}return out}
function missedIn(p,dk){const t=iso(p.today);return plannedIn(p).filter(x=>x.date<t&&!(dk[iso(satStart(x.d))]||new Set()).has(x.key))}
function aggregate(p,cutoff){
  const hi=cutoff&&cutoff<p.ei?cutoff:p.ei;
  const ws=Store.list().filter(w=>w.date>=p.si&&w.date<=hi).map(w=>Object.assign({w},wStats(w)));
  const tot={count:ws.length,dur:0,kcal:0,vol:0,sets:0,groups:{}};
  ws.forEach(x=>{tot.dur+=x.dur;tot.kcal+=x.kcal;tot.vol+=x.vol;tot.sets+=x.sets;for(const g in x.groups)tot.groups[g]=(tot.groups[g]||0)+x.groups[g]});
  const series={};['kcal','dur','vol','sets'].forEach(m=>{series[m]=p.buckets.map(b=>ws.reduce((a,x)=>a+(x.w.date>=b.s&&x.w.date<=b.e?x[m]:0),0))});
  return{ws,tot,series};
}
function fullWeekStreak(dk){
  const keys=DAYS.map(d=>d.key),full=s=>{const set=dk[iso(s)];return !!set&&keys.every(k=>set.has(k))};
  let s=satStart(new Date()),n=0;if(!full(s))s=addDays(s,-7);
  while(full(s)){n++;s=addDays(s,-7)}
  return n;
}
function insights(p,a,pa){
  const out=[],t=a.tot,u=S.unit,isCur=p.off===0,rn=p.range,dk=doneKeysByWeek();
  const add=(tone,ic,b,txt)=>out.push({tone,ic,b,txt});
  if(!t.count){add('info',IC.info,'No workouts logged',isCur?'Tick off a set in any workout and it will show up here.':`Nothing was logged this ${rn}.`);return out}
  const plan=plannedIn(p).length;
  if(plan){const pct=Math.round(Math.min(1,t.count/plan)*100);add(pct>=90?'good':pct>=60?'info':'warn',IC.calendar,`${t.count} of ${plan} planned workouts${isCur?' so far':''}`,pct>=90?'Excellent consistency. This is what drives long-term results.':pct>=60?`${pct}% adherence. Aim to hit every planned session.`:`${pct}% adherence. Consistency matters more than any single workout.`)}
  if(isCur){const st=fullWeekStreak(dk);if(st>=2)add('good',IC.flame,`${st}-week streak`,'Weeks in a row with all four workouts done. Keep it going.')}
  if(pa.tot.count){const av=t.vol/t.count,pv=pa.tot.vol/pa.tot.count;if(pv>0&&av>0){const ch=Math.round((av-pv)/pv*100);add(ch>=0?'good':'warn',ch>=0?IC.up:IC.down,`Volume per workout ${ch>=0?'up':'down'} ${Math.abs(ch)}%`,`${fmtK(av)} ${u} per session vs ${fmtK(pv)} ${u} the previous ${rn}${isCur?' at this point':''}.`)}}
  add('info',IC.clock,`Average session: ${fmtDur(t.dur/t.count)}`,`About ${fmtInt(t.kcal/t.count)} kcal per workout, ${fmtInt(t.kcal)} kcal in total. Estimated from duration and your body weight.`);
  let gain=null,stall=null;
  Object.keys(EX).forEach(id=>{
    const h=exHistory(id);if(!h.length)return;
    const before=h.filter(e=>e.wk.date<p.si),inP=h.filter(e=>e.wk.date>=p.si&&e.wk.date<=p.ei);
    if(before.length&&inP.length){const b=Math.max(...before.map(e=>e.e1)),n=Math.max(...inP.map(e=>e.e1));if(b>0&&n>b){const ch=(n-b)/b;if(!gain||ch>gain.ch)gain={id,ch,b,n}}}
    const l3=h.filter(e=>e.wk.date<=p.ei).slice(-3);
    if(!stall&&l3.length===3&&l3[2].wk.date>=p.si&&l3[0].e1>0&&l3[1].e1<=l3[0].e1&&l3[2].e1<=l3[0].e1)stall=id;
  });
  if(gain)add('good',IC.trophy,`Biggest gain: ${EX[gain.id].name}`,`Estimated 1RM up ${Math.round(gain.ch*100)}% (${r1(gain.b)} → ${r1(gain.n)} ${u}).`);
  if(stall)add('warn',IC.alert,`${EX[stall].name} has stalled`,EX[stall].assist?'No progress over the last 3 sessions. Add one rep per set, or take a little assistance off.':'No progress over the last 3 sessions. Add one rep per set, or make a small weight jump.');
  const miss=missedIn(p,dk);
  if(miss.length){const c={};miss.forEach(x=>c[x.key]=(c[x.key]||0)+1);const k=Object.keys(c).sort((x,y)=>c[y]-c[x])[0];add('warn',IC.calendar,`Most skipped: ${DAY[k].title}`,`Missed ${c[k]}× this ${rn}. If that day doesn't suit you, move it to another day in the same week.`)}
  return out;
}

/* ---------- Charts (pure SVG, no libraries) ---------- */
function niceMax(v){if(v<=0)return 1;const p=Math.pow(10,Math.floor(Math.log10(v))),n=v/p;return(n<=1?1:n<=2?2:n<=5?5:10)*p}
function barChart(vals,labels,ax,sel,aria){
  const W=340,Hh=170,L=38,B=22,T=10,pw=W-L-6,ph=Hh-B-T,n=vals.length,max=niceMax(Math.max(...vals)),slot=pw/n,bw=Math.max(3,Math.min(28,slot*.62));
  let g='',bars='',lbl='',hits='';
  [0,.5,1].forEach(f=>{const y=(T+ph*(1-f)).toFixed(1);g+=`<line x1="${L}" x2="${W-6}" y1="${y}" y2="${y}"/><text x="${L-6}" y="${(+y+3).toFixed(1)}" text-anchor="end">${ax(max*f)}</text>`});
  vals.forEach((v,k)=>{
    const x=L+slot*k+(slot-bw)/2,h=v>0?Math.max(3,ph*v/max):2,y=T+ph-h;
    bars+=`<rect class="bar${v>0?'':' bar0'}${sel!=null&&sel!==k?' dim':''}" data-k="${k}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="${Math.min(4,bw/2).toFixed(1)}" style="animation-delay:${k*(n>12?12:35)}ms"/>`;
    if(labels[k])lbl+=`<text x="${(L+slot*k+slot/2).toFixed(1)}" y="${Hh-6}" text-anchor="middle">${labels[k]}</text>`;
    hits+=`<rect class="hit" tabindex="0" role="button" aria-label="${esc(aria?aria[k]:'')}" data-k="${k}" x="${(L+slot*k).toFixed(1)}" y="${T}" width="${slot.toFixed(1)}" height="${ph}"/>`;
  });
  return `<svg class="chart" viewBox="0 0 ${W} ${Hh}" role="group" aria-label="Bar chart"><g class="grid" aria-hidden="true">${g}</g><g aria-hidden="true">${bars}</g><g aria-hidden="true">${lbl}</g>${hits}</svg>`;
}
function lineChart(pts,label){
  const W=340,Hh=170,L=38,B=22,T=12,pw=W-L-12,ph=Hh-B-T;
  const ys=pts.flatMap(p=>[p.y,p.y2]).filter(v=>v>0);if(!ys.length)return '';
  let mn=Math.min(...ys),mx=Math.max(...ys);if(mn===mx){mn*=.9;mx*=1.1}
  const pad=(mx-mn)*.12;mn=Math.max(0,mn-pad);mx+=pad;
  const n=pts.length,X=k=>L+(n===1?pw/2:pw*k/(n-1)),Y=v=>T+ph*(1-(v-mn)/(mx-mn));
  const path=key=>pts.map((p,k)=>p[key]>0?[X(k),Y(p[key])]:null).filter(Boolean);
  const p1=path('y'),p2=path('y2'),str=a=>a.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ');
  let g='';[0,.5,1].forEach(f=>{const v=mn+(mx-mn)*f,y=Y(v).toFixed(1);g+=`<line x1="${L}" x2="${W-6}" y1="${y}" y2="${y}"/><text x="${L-6}" y="${(+y+3).toFixed(1)}" text-anchor="end">${fmtK(v)}</text>`});
  const area=p1.length>1?`<path class="area" d="M${p1[0][0].toFixed(1)},${T+ph} L${str(p1).replace(/ /g,' L')} L${p1[p1.length-1][0].toFixed(1)},${T+ph} Z"/>`:'';
  const dots=p1.map(q=>`<circle class="dot" cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="3.5"/>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${esc(label||'Progress chart')}"><g class="grid">${g}</g>${area}${p2.length>1?`<polyline class="ln2" points="${str(p2)}"/>`:''}${p1.length>1?`<polyline class="ln" points="${str(p1)}"/>`:''}${dots}<g><text x="${L}" y="${Hh-5}">${pts[0].lbl}</text><text x="${W-6}" y="${Hh-5}" text-anchor="end">${pts[n-1].lbl}</text></g></svg>`;
}

/* ---------- Images ---------- */
const imgCache=new Map(),probeCache=new Map();
function probe(url){
  if(!probeCache.has(url))probeCache.set(url,new Promise(res=>{const im=new Image();im.onload=()=>res(true);im.onerror=()=>res(false);im.src=url}));
  return probeCache.get(url);
}
function resolveImg(exId){
  if(!imgCache.has(exId))imgCache.set(exId,(async()=>{for(const id of EX[exId].img){const a=IMG+id+'/0.jpg';if(await probe(a))return{a,b:IMG+id+'/1.jpg'}}return null})());
  return imgCache.get(exId);
}
function loadThumbs(){
  $$('.thumb',app).forEach(async t=>{
    const r=await resolveImg(t.dataset.ex),im=$('img',t);
    if(!r){t.classList.add('none');return}
    im.onload=()=>t.classList.add('ok');im.src=r.a;
    if(im.complete&&im.naturalWidth)t.classList.add('ok');
  });
}
let mediaTimer=null,mediaPaused=RM;
function stopMedia(){clearInterval(mediaTimer);mediaTimer=null}
async function setupMedia(exId){
  const m=$('#media',sbody);if(!m)return;
  const r=await resolveImg(exId);if(!m.isConnected)return;
  const[f0,f1]=$$('.frame',m),tag=$('.media-tag',m),btn=$('.media-btn',m);
  if(!r){m.classList.add('failed');$('.media-ph span',m).textContent='Image unavailable — watch the tutorial below';return}
  f0.alt=EX[exId].name+', start position';f0.src=r.a;f0.classList.add('on');m.classList.add('ready');
  if(!(await probe(r.b))||!m.isConnected)return;
  f1.alt=EX[exId].name+', end position';f1.src=r.b;m.classList.add('anim');
  let on=0;
  const paint=()=>{btn.innerHTML=mediaPaused?IC.play:IC.pause;btn.setAttribute('aria-label',mediaPaused?'Play animation':'Pause animation')};
  paint();btn.onclick=e=>{e.stopPropagation();mediaPaused=!mediaPaused;paint()};
  stopMedia();
  mediaTimer=setInterval(()=>{if(mediaPaused)return;on^=1;f0.classList.toggle('on',!on);f1.classList.toggle('on',!!on);tag.textContent=on?'Finish':'Start'},1400);
}

/* ---------- Program views ---------- */
function ring(p){
  if(p>=1)return `<span class="done-badge">${IC.check}</span>`;
  const C=2*Math.PI*15;
  return `<svg class="ring" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" class="ring-bg"/><circle cx="18" cy="18" r="15" class="ring-fg" stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="${(C*(1-p)).toFixed(2)}"/></svg>`;
}
function homeView(){
  const now=new Date(),dow=now.getDay(),today=DAYS.find(d=>d.dow===dow);
  let next=null,inD=0;
  for(let k=1;k<=7;k++){const d=DAYS.find(x=>x.dow===(dow+k)%7);if(d){next=d;inD=k;break}}
  const date=now.toLocaleDateString(locale(),{weekday:'long',month:'long',day:'numeric'});
  const nextTxt=`Next up: <b>${next.title}</b> ${inD===1?'tomorrow':'on '+next.day}.`;
  /* a make-up or past-midnight workout that's still running */
  const live=DAYS.find(d=>{if(today&&d.key===today.key)return false;const w=todayW(d.key);return !!(w&&!w.finishedAt&&(w.startedAt||hasActivity(w)))});
  let hero;
  if(live){
    const p=dayProgress(live.key);
    hero=`<div class="hero"><p class="eyebrow">${date} · In progress</p><h1>${live.title}</h1><p class="sub">${live.focus} · ${p.done}/${p.total} sets done</p><a class="btn-primary press" href="#/${live.key}"><span class="cta-t">Continue workout</span>${IC.chev}</a></div>`;
  }else if(today){
    const p=dayProgress(today.key),w=todayW(today.key);
    if(w&&w.finishedAt){const st=wStats(w);hero=`<div class="hero"><p class="eyebrow">${date}</p><h1>Workout complete</h1><p class="sub">${today.title} · ${fmtDur(st.dur)} · ${fmtInt(st.kcal)} kcal. ${nextTxt}</p><a class="btn-secondary press" href="#/${today.key}">Review ${today.title}${IC.chev}</a></div>`}
    else hero=`<div class="hero"><p class="eyebrow">${date}</p><h1>${today.title}</h1><p class="sub">${today.focus} · ${today.items.length} exercises · ~${estMin(today.key)} min</p><a class="btn-primary press" href="#/${today.key}"><span class="cta-t">${p.done?`Continue · ${p.done}/${p.total} sets`:'Open workout'}</span>${IC.chev}</a></div>`;
  }else hero=`<div class="hero"><p class="eyebrow">${date}</p><h1>Rest day</h1><p class="sub">Recover well. ${nextTxt}</p><a class="btn-secondary press" href="#/${next.key}">Preview ${next.title}${IC.chev}</a></div>`;
  const week=[6,0,1,2,3,4,5].map(d=>{
    const t=DAYS.find(x=>x.dow===d),w=t?weekDone(t.key):null,full=w&&w.done>=w.total;
    const cls=['wk',t?'train press':'',d===dow?'today':'',full?'full':''].join(' ');
    const inner=`<span class="wk-l">${DN[d]}</span><span class="wk-d">${full?IC.check:t?t.title.replace('Upper','Up').replace('Lower','Lo'):'Rest'}</span>`;
    return t?`<a class="${cls}" href="#/${t.key}" aria-label="${t.day}, ${t.title}${full?', done':''}">${inner}</a>`:`<div class="${cls}">${inner}</div>`;
  }).join('');
  const wt=aggregate(period('week',0)).tot;
  const cards=DAYS.map((d,k)=>{
    const w=weekDone(d.key),isT=d.dow===dow,full=w.done>=w.total;
    const pill=isT?'<span class="pill">Today</span>':full?'<span class="pill dim">Done</span>':(!today&&next.key===d.key)?'<span class="pill">Next</span>':'';
    return `<a class="day-card press${isT?' is-today':''}" href="#/${d.key}" style="--i:${k+4}">
      <span class="day-badge">${d.short}</span>
      <span class="dc-main"><span class="dc-top"><span class="dc-title">${d.title}</span>${pill}</span>
      <span class="dc-focus">${d.focus}</span><span class="dc-meta">${d.items.length} exercises · ${w.total} sets · ~${estMin(d.key)} min</span></span>
      ${w.done?ring(w.done/w.total):IC.chev}</a>`;
  }).join('');
  return `<section class="view"><div class="stagger">${hero}
    <p class="label mt" style="--i:1">This week</p><div class="week" style="--i:1">${week}</div>
    <a class="wk-sum press" href="#/history" style="--i:2"><div><b>${wt.count}<small>/4</small></b><span>Workouts</span></div><div><b>${fmtDur(wt.dur)}</b><span>Time</span></div><div><b>${fmtInt(wt.kcal)}</b><span>kcal</span></div>${IC.chev}</a>
    <p class="label" style="--i:3">Workouts</p>${cards}
    <a class="rules-link press" href="#/rules" style="--i:8">${IC.info}<span><b>Execution rules</b><small>Effort, rest and progression</small></span>${IC.chev}</a></div></section>`;
}
function dotsHTML(key,i){const it=DAY[key].items[i],s=session(key,i);let h='';for(let j=0;j<it.sets;j++)h+=`<i class="${s&&s.sets[j]&&s.sets[j].d?'on':''}"></i>`;return h}
function rowHTML(key,i,nx,started){
  const it=DAY[key].items[i],exId=selectedEx(key,i),ex=EX[exId],complete=doneCount(key,i)>=it.sets,alt=exId!==it.ex;
  return `<a class="ex-row press${complete?' complete':''}${started&&i===nx?' next':''}" href="#/${key}/${i}" data-i="${i}" style="--i:${i}">
    <span class="thumb" data-ex="${exId}"><img alt="" decoding="async"><em>${i+1}</em></span>
    <span class="ex-main"><span class="up">Up next</span><span class="ex-name">${ex.name}${alt?'<small class=\"alt-badge\">ALT</small>':''}</span>
    <span class="ex-meta"><b>${it.sets} × ${repsTxt(it)}</b>${sideKind(ex)?' each '+sideKind(ex):''} · ${isComp(it,exId)?'Compound':'Isolation'}</span>
    <span class="dots">${dotsHTML(key,i)}</span></span>${IC.chev}</a>`;
}
function headHTML(key){
  const d=DAY[key],p=dayProgress(key),its=d.items,isT=d.dow===new Date().getDay(),nx=nextIdx(key),wk=weekDone(key),w=todayW(key);
  const started=!!(w&&(w.startedAt||p.done)),finished=!!(w&&w.finishedAt);
  const eyebrow=d.day+(isT?' · Today':'')+(!started&&wk.done>=wk.total?' · Done this week':'');
  let cta;
  if(finished){const st=wStats(w);cta=`<div class="done-card"><span class="done-badge">${IC.check}</span><span><b>Workout complete</b><small>${fmtDur(st.dur)} · ${fmtInt(st.kcal)} kcal · ${fmtK(st.vol)} ${S.unit} · ${st.sets} sets</small></span></div><a class="btn-secondary press mt-s" href="#/${key}/w/${esc(w.id)}">View summary${IC.chev}</a>`}
  else if(started){
    const el=w.startedAt?(Date.now()-w.startedAt)/60000:0;
    cta=`<p class="live"><i></i><span id="elapsed">In progress · ${fmtDur(el)}</span></p>`+(nx===-1
      ?`<button class="btn-primary press" data-act="finish"><span class="cta-t">Finish workout</span>${IC.flag}</button>`
      :`<a class="btn-primary press" href="#/${key}/${nx}"><span class="cta-t">Continue: ${EX[selectedEx(key,nx)].name}</span>${IC.chev}</a><button class="ghost press mt-s wide" data-act="finish">${IC.flag} Finish workout</button>`);
  }else cta=`<a class="btn-primary press" href="#/${key}/${Math.max(0,nx)}" data-act="start"><span class="cta-t">Start workout</span>${IC.play}</a>`;
  return `<p class="eyebrow">${eyebrow}</p><h1>${d.title}</h1><p class="sub">${d.focus}</p>
    <div class="stats"><div><b>${its.length}</b><span>Exercises</span></div><div><b>${p.total}</b><span>Sets</span></div><div><b>~${estMin(key)}</b><span>Minutes</span></div></div>
    <div class="prog"><div class="prog-bar"><i style="width:${p.total?p.done/p.total*100:0}%"></i></div><span class="prog-txt">${p.done} / ${p.total} sets</span></div>${cta}`;
}
function dayView(key){
  const its=DAY[key].items,nx=nextIdx(key),started=dayProgress(key).done>0;
  let list='',k=0;
  while(k<its.length){
    if(its[k].ss){const g=its[k].ss,start=k;let inner='';while(k<its.length&&its[k].ss===g){inner+=rowHTML(key,k,nx,started);k++}
      list+=`<div class="ss" style="--i:${start}"><div class="ss-label">${IC.link} Optional superset ${g}</div>${inner}</div>`}
    else{list+=rowHTML(key,k,nx,started);k++}
  }
  return `<section class="view">
    <div class="day-head">${headHTML(key)}</div>
    <div class="ex-list stagger">${list}</div>
    <div class="day-foot"><a class="ghost press" href="#/${key}/rules">${IC.info} Rules</a><button class="ghost press" data-act="reset">${IC.refresh} Reset today</button></div>
  </section>`;
}
function updateDay(key){
  if(cur.base!==key)return;
  const head=$('.day-head',app);if(!head)return;
  head.innerHTML=headHTML(key);
  const nx=nextIdx(key),started=dayProgress(key).done>0;
  $$('.ex-row',app).forEach(row=>{
    const i=+row.dataset.i,it=DAY[key].items[i],exId=selectedEx(key,i),ex=EX[exId],alt=exId!==it.ex;
    $('.dots',row).innerHTML=dotsHTML(key,i);
    $('.ex-name',row).innerHTML=ex.name+(alt?'<small class=\"alt-badge\">ALT</small>':'');
    $('.ex-meta',row).innerHTML=`<b>${it.sets} × ${repsTxt(it)}</b>${sideKind(ex)?' each '+sideKind(ex):''} · ${isComp(it,exId)?'Compound':'Isolation'}`;
    const th=$('.thumb',row);if(th&&th.dataset.ex!==exId){th.dataset.ex=exId;th.classList.remove('ok','none');const im=$('img',th);if(im)im.removeAttribute('src')}
    row.classList.toggle('complete',doneCount(key,i)>=it.sets);
    row.classList.toggle('next',started&&i===nx);
  });loadThumbs();
}

/* ---------- History views ---------- */
const HV={range:'week',off:0,metric:'kcal',sel:null,p:null,a:null};
const METRIC={
  kcal:{l:'Calories',f:v=>fmtInt(v)+' kcal',ax:fmtK},
  dur:{l:'Duration',f:fmtDur,ax:fmtDur},
  vol:{l:'Volume',f:v=>fmtK(v)+' '+S.unit,ax:fmtK},
  sets:{l:'Sets',f:v=>fmtInt(v)+' sets',ax:fmtInt}
};
function pnavInner(){const p=period(HV.range,HV.off);return `<button class="icon-btn" data-act="poff" data-d="-1" aria-label="Previous ${HV.range}">${IC.back}</button><div class="pnav-t" aria-live="polite"><span class="eyebrow">${p.eyebrow}</span><b>${p.label}</b></div><button class="icon-btn" data-act="poff" data-d="1" aria-label="Next ${HV.range}" ${HV.off>=0?'disabled':''}>${IC.chev}</button>`}
function historyView(){
  return `<section class="view hv"><div class="day-head hv-head"><p class="eyebrow">Your training</p><h1>History</h1></div>
    <div class="seg" id="rangeSeg" style="--n:3;--v:${RANGES.indexOf(HV.range)}" role="tablist"><i class="pill"></i>${RANGES.map(r=>`<button data-act="range" data-v="${r}" class="${HV.range===r?'on':''}" role="tab" aria-controls="hvBody" aria-selected="${HV.range===r}">${r[0].toUpperCase()+r.slice(1)}</button>`).join('')}</div>
    <div class="pnav" id="pnav">${pnavInner()}</div>
    <div class="stagger" id="hvBody" role="tabpanel">${historyBody()}</div></section>`;
}
function historyBody(){
  const p=period(HV.range,HV.off),pp=period(HV.range,HV.off-1);
  const cut=HV.off===0?iso(addDays(pp.s,Math.round((p.today-p.s)/864e5))):null;
  const a=aggregate(p),pa=aggregate(pp,cut);HV.p=p;HV.a=a;
  const t=a.tot,plan=plannedIn(p).length;
  const kpi=(l,v,sub,c,pv)=>{let d='';if(pv>0){const ch=Math.round((c-pv)/pv*100);d=`<em class="${ch>=0?'up':'down'}">${ch>=0?'▲':'▼'} ${Math.abs(ch)}%</em>`}return `<div class="kpi"><span>${l}</span><b>${v}${sub?`<small>${sub}</small>`:''}</b>${d}</div>`};
  return `
    <div class="kpis" style="--i:0">${kpi('Workouts',t.count,plan?`of ${plan}`:'',t.count,pa.tot.count)}${kpi('Time',fmtDur(t.dur),'',t.dur,pa.tot.dur)}${kpi('Calories',fmtInt(t.kcal),'kcal',t.kcal,pa.tot.kcal)}${kpi('Volume',fmtK(t.vol),S.unit,t.vol,pa.tot.vol)}</div>
    <p class="kpi-note" style="--i:1">${HV.off===0?`Changes compared with the same point last ${p.range}. Calories are estimates.`:`Changes compared with the previous ${p.range}. Calories are estimates.`}</p>
    <div class="card" style="--i:2" id="chartBox">${chartBox()}</div>
    <div class="card" style="--i:3"><div class="card-h"><b>${p.range==='year'?'Months':'Training days'}</b></div>${calHTML(p)}</div>
    <div class="card" style="--i:4"><div class="card-h"><b>Analysis</b></div>${insights(p,a,pa).map(x=>`<div class="ins ${x.tone}"><span class="ins-ic">${x.ic}</span><div><b>${x.b}</b><p>${x.txt}</p></div></div>`).join('')}</div>
    ${t.sets?`<div class="card" style="--i:5"><div class="card-h"><b>Sets by muscle group</b><span class="card-s">${t.sets} sets</span></div>${musclesHTML(t.groups)}</div>`:''}
    ${a.ws.length?`<p class="label mt" style="--i:6">Workouts</p><div class="list" style="--i:6">${a.ws.slice().reverse().map(wRow).join('')}</div>`:''}
    ${exListHTML()}`;
}
function chartBox(){
  const m=METRIC[HV.metric],vals=HV.a.series[HV.metric];
  return `<div class="card-h"><b>Trend</b></div><div class="mchips">${Object.keys(METRIC).map(k=>`<button class="mchip press${HV.metric===k?' on':''}" data-act="metric" data-v="${k}" aria-pressed="${HV.metric===k}">${METRIC[k].l}</button>`).join('')}</div>
    <p class="chart-cap" id="chartCap" aria-live="polite">${capHTML()}</p>${barChart(vals,HV.p.buckets.map(b=>b.lbl),m.ax,HV.sel,HV.p.buckets.map((b,k)=>`${b.cap}: ${m.f(vals[k])}`))}`;
}
function capHTML(){
  const m=METRIC[HV.metric],vals=HV.a.series[HV.metric];
  if(HV.sel!=null)return `${HV.p.buckets[HV.sel].cap}: <b>${m.f(vals[HV.sel])}</b>`;
  const tot=vals.reduce((x,y)=>x+y,0);
  return HV.a.tot.count?`Total <b>${m.f(tot)}</b> · avg <b>${m.f(tot/HV.a.tot.count)}</b> per workout`:'No data for this period yet';
}
function calHTML(p){
  if(p.range==='year')return yearTiles(p);
  const byDate={};Store.list().forEach(w=>{(byDate[w.date]=byDate[w.date]||[]).push(w)});
  const dk=doneKeysByWeek(),t=iso(p.today);
  let h=[6,0,1,2,3,4,5].map(d=>`<span class="cal-h">${DN[d].slice(0,2)}</span>`).join('');
  const pad=(p.s.getDay()+1)%7;for(let k=0;k<pad;k++)h+='<span></span>';
  for(let d=new Date(p.s);d<=p.e;d=addDays(d,1)){
    const di=iso(d),ws=byDate[di],plan=DAYS.find(x=>x.dow===d.getDay());let cls='cal-d';
    if(!ws&&plan){const set=dk[iso(satStart(d))];if(!(set&&set.has(plan.key)))cls+=di<t?' miss':' plan'}
    if(di===t)cls+=' today';
    h+=ws?`<a class="${cls} done press" href="#/history/w/${esc(ws[ws.length-1].id)}" aria-label="${fmtDate(di)}, ${DAY[ws[0].day]?DAY[ws[0].day].title:'workout'}">${d.getDate()}</a>`:`<span class="${cls}">${d.getDate()}</span>`;
  }
  return `<div class="cal">${h}</div><div class="legend"><span><i class="lg"></i>Trained</span><span><i class="lg miss"></i>Missed</span><span><i class="lg plan"></i>Planned</span></div>`;
}
function yearTiles(p){
  const now=new Date(),t=iso(p.today),all=Store.list();
  return `<div class="yr">${p.buckets.map((b,m)=>{
    const n=all.filter(w=>w.date>=b.s&&w.date<=b.e).length,fut=b.s>t;
    const pl=fut?0:plannedIn({s:parseISO(b.s),e:parseISO(b.e),today:p.today}).length,pct=pl?Math.min(1,n/pl):0;
    const off=(parseISO(b.s).getFullYear()-now.getFullYear())*12+m-now.getMonth();
    return `<button class="yr-m press" data-act="tomonth" data-off="${off}" ${fut?'disabled':''} aria-label="${b.cap}: ${n} workouts"><span>${parseISO(b.s).toLocaleDateString('en-US',{month:'short'})}</span><b>${n}</b><i><u style="width:${Math.round(pct*100)}%"></u></i></button>`;
  }).join('')}</div><p class="legend-t">Workouts per month. The bar shows how closely you followed the plan.</p>`;
}
function musclesHTML(g){const mx=Math.max(1,...GROUPS.map(k=>g[k]||0));return GROUPS.map((k,i)=>`<div class="mb"><span>${k}</span><div class="mb-bar"><i style="width:${Math.round((g[k]||0)/mx*100)}%;animation-delay:${i*40}ms"></i></div><b>${g[k]||0}</b></div>`).join('')}
function wRow(x){
  const w=x.w,d=parseISO(w.date),t=DAY[w.day];
  return `<a class="w-row press" href="#/history/w/${esc(w.id)}"><span class="w-date"><b>${d.getDate()}</b><small>${d.toLocaleDateString('en-US',{month:'short'})}</small></span><span class="ex-main"><span class="ex-name">${t?t.title:'Workout'}<span class="w-dn">${DN[d.getDay()]}</span></span><span class="ex-meta">${fmtDur(x.dur)} · ${fmtInt(x.kcal)} kcal · ${fmtK(x.vol)} ${S.unit} · ${x.sets} sets</span></span>${IC.chev}</a>`;
}
function exListHTML(){
  const rows=[];
  Object.keys(EX).forEach(id=>{
    const ex=EX[id],h=exHistory(id);if(!h.length)return;
    const l=h[h.length-1],pv=h[h.length-2],tr=!pv?'':l.e1>pv.e1?'up':l.e1<pv.e1?'down':'flat';
    const last=topTxt(ex,l.top)||setTxt(l.sets[0],ex);
    rows.push(`<a class="x-row press" href="#/history/x/${id}"><span class="ex-main"><span class="ex-name">${ex.name}</span><span class="ex-meta">Last: ${last} · ${fmtDate(l.wk.date)}</span></span>${tr?`<span class="tr ${tr}" aria-label="Trend ${tr}">${tr==='up'?IC.up:tr==='down'?IC.down:IC.minus}</span>`:''}${IC.chev}</a>`);
  });
  rows.sort((a,b)=>a.localeCompare(b));
  return rows.length?`<p class="label mt" style="--i:7">Exercise progress</p><div class="list" style="--i:7">${rows.join('')}</div>`:'';
}
function updateHistory(){
  const seg=$('#rangeSeg',app);if(!seg)return;
  seg.style.setProperty('--v',RANGES.indexOf(HV.range));
  $$('button',seg).forEach(b=>{const on=b.dataset.v===HV.range;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
  $('#pnav',app).innerHTML=pnavInner();
  $('#hvBody',app).innerHTML=historyBody();
}

/* ---------- Sheets ---------- */
function histRows(list,ex){return list.map(e=>`<div class="xh"><div class="xh-top"><span>${fmtDate(e.wk.date)} · ${relDays(e.wk.date)}</span>${e.pr?'<span class="pr">PR</span>':''}<em>${e.e1?'e1RM '+r1(e.e1):''}</em></div><div class="set-chips">${e.sets.map(s=>`<span>${setTxt(s,ex)}</span>`).join('')}</div></div>`).join('')}
function exSheet(day,i,tab){
  const d=DAY[day],it=d.items[i],exId=selectedEx(day,i),ex=EX[exId],comp=isComp(it,exId),opts=optionsFor(it);
  const s=session(day,i),hist=exHistory(exId,todayId(day)),prev=hist[hist.length-1]||null;
  const n=doneCount(day,i),allDone=n>=it.sets;
  const yt='https://www.youtube.com/results?search_query='+encodeURIComponent(ex.yt);
  const topHit=prev&&prev.sets.length>=it.sets&&prev.sets.slice(0,it.sets).every(x=>num(x.r)>=it.reps[1]);
  let rows='',carry='';
  for(let j=0;j<it.sets;j++){
    const c=s&&s.sets[j]||{w:'',r:'',d:false},p=prev&&prev.sets[j]||{},pw=carry||p.w||'';
    rows+=`<div class="set-row${c.d?' done':''}"><span class="set-n">${j+1}</span>
      <label class="fld"><input type="text" inputmode="decimal" autocomplete="off" enterkeyhint="next" data-f="w" data-s="${j}" value="${esc(c.w)}" placeholder="${esc(pw||'–')}" data-p="${esc(pw)}" data-p0="${esc(p.w||'')}" aria-label="Set ${j+1} ${ex.assist?'assistance':'weight'}"><em>${S.unit}</em></label>
      <label class="fld"><input type="text" inputmode="numeric" autocomplete="off" enterkeyhint="done" data-f="r" data-s="${j}" value="${esc(c.r)}" placeholder="${esc(p.r||repsTxt(it))}" data-p="${esc(p.r||'')}" aria-label="Set ${j+1} reps"><em>reps</em></label>
      <button class="chk" data-act="check" data-s="${j}" aria-pressed="${c.d}" aria-label="Mark set ${j+1} done">${IC.check}</button></div>`;
    if(c.w)carry=c.w;
  }
  const histHTML=hist.length?`<p class="h3 mt">Previous sessions</p><div class="xh-list">${histRows(hist.slice(-3).reverse(),ex)}</div><a class="ghost press rest-btn" href="#/${day}/x/${exId}">${IC.chart} Full history and progress chart</a>`:'';
  const pv=i>0?`<button class="nav-btn press" data-act="nav" data-to="${i-1}">${IC.back}<span><small>Previous</small>${EX[selectedEx(day,i-1)].name}</span></button>`:'<span></span>';
  const nx=i<d.items.length-1?`<button class="nav-btn nx press${allDone?' go':''}" data-act="nav" data-to="${i+1}"><span><small>Next</small>${EX[selectedEx(day,i+1)].name}</span>${IC.chev}</button>`
    :`<button class="nav-btn nx press${allDone?' go':''}" data-act="close"><span><small>Last exercise</small>Back to workout</span>${IC.check}</button>`;
  return `<div class="sx${tab===1?' log':''}">
    <div class="media-wrap"><div class="media-in"><div class="media" id="media"><div class="media-ph">${IC.dumbbell}<span>Loading demo</span></div><img class="frame" alt=""><img class="frame" alt=""><span class="media-tag">Start</span><button class="media-btn" aria-label="Pause animation"></button></div></div></div>
    <div class="sx-head">
      <p class="eyebrow">Exercise ${i+1} of ${d.items.length} · ${comp?'Compound':'Isolation'}${it.ss?' · Superset '+it.ss:''}</p>
      <h2 class="sx-title">${ex.name}</h2>
      <div class="chips">${ex.muscles.map(m=>`<span class="chip">${m}</span>`).join('')}</div>
      <div class="specs">
        <div class="spec"><span>Sets</span><b>${it.sets}</b></div>
        <div class="spec"><span>Reps</span><b>${repsTxt(it)}${sideKind(ex)?'/'+sideKind(ex):''}</b></div>
        <div class="spec"><span>Rest</span><b>${fmt(restFor(it,exId))}</b></div>
        <div class="spec"><span>${comp?'Effort':'Last set'}</span><b>${comp?'1–2 RIR':'0–1 RIR'}</b></div>
      </div>
      <div class="seg" style="--v:${tab}" role="tablist"><i class="pill"></i>
        <button role="tab" id="tab0" aria-controls="pan0" data-act="tab" data-v="0" class="${tab===0?'on':''}" aria-selected="${tab===0}">Technique</button>
        <button role="tab" id="tab1" aria-controls="pan1" data-act="tab" data-v="1" class="${tab===1?'on':''}" aria-selected="${tab===1}">Log sets <span class="cnt" id="logCnt">${n}/${it.sets}</span></button>
      </div>
    </div>
    <div class="sx-body">
      <div class="panel" id="pan0" role="tabpanel" aria-labelledby="tab0" ${tab===0?'':'hidden'}>
        <a class="yt press" href="${yt}" target="_blank" rel="noopener"><span class="yt-ic">${IC.yt}</span>Watch tutorial on YouTube<span class="ext">${IC.ext}</span></a>
        <p class="h3">Choose exercise</p><div class="exercise-options">${opts.map((id,k)=>`<button class="exercise-option press${id===exId?' active':''}" data-act="choose-ex" data-ex="${id}" aria-pressed="${id===exId}"><span class="option-no">${k===0?'MAIN':'ALT '+k}</span><b>${EX[id].name}</b>${id===exId?IC.check:''}</button>`).join('')}</div><p class="option-note">Choose the version available in your gym. Weight, reps and progress history are tracked separately for each option.</p>
        <p class="h3">How to do it</p><ol class="steps">${ex.steps.map(x=>`<li><span>${x}</span></li>`).join('')}</ol>
        <p class="h3">Form tips</p><ul class="tips">${ex.tips.map(x=>`<li>${IC.check}<span>${x}</span></li>`).join('')}</ul>
        <p class="note">${IC.info}<span>${comp?'Stop with 1–2 reps in reserve. Don\'t regularly take heavy compound lifts to complete failure.':'Earlier sets stop short of failure; only the last set can reach 0–1 reps in reserve.'}${it.ss?' Optional superset: alternate with the paired exercise to save time.':''}</span></p>
      </div>
      <div class="panel" id="pan1" role="tabpanel" aria-labelledby="tab1" ${tab===1?'':'hidden'}>
        ${topHit?`<div class="hint">${IC.trend}<span>${ex.assist?'You hit the top of the rep range on every set last time. Take a little assistance off today.':'You hit the top of the rep range on every set last time. Increase the weight slightly today.'}</span></div>`:''}
        ${ex.assist?`<p class="first-log">Enter the <b>assistance</b> weight. Leave it empty for bodyweight. Less assistance counts as progress.</p>`:''}
        ${prev?'':`<p class="first-log">First time logging this one. Your numbers will show as hints next session.</p>`}
        <div class="set-head"><span>#</span><span>${ex.assist?'Assist':'Weight'}</span><span>Reps</span><span></span></div>
        ${rows}
        <button class="ghost press rest-btn" data-act="rest">${IC.clock} Start ${fmt(restFor(it,exId))} rest timer</button>
        ${histHTML}
      </div>
    </div>
    <div class="sx-nav">${pv}${nx}</div>
  </div>`;
}
function xSheet(exId){
  const ex=EX[exId],u=S.unit,h=exHistory(exId).map(e=>Object.assign({},e));
  const head=`<p class="eyebrow">Exercise history</p><h2 class="sx-title">${ex.name}</h2><div class="chips">${ex.muscles.map(m=>`<span class="chip">${m}</span>`).join('')}</div>`;
  if(!h.length)return `<div class="sx"><div class="sx-pad">${head}<p class="first-log">No sets logged yet. Your history for this exercise will build up here.</p></div></div>`;
  let best=0,heavy=null,run=0;
  h.forEach(e=>{best=Math.max(best,e.e1);if(e.top&&(!heavy||e.top.L>heavy.L))heavy=e.top;e.pr=run>0&&e.e1>run;run=Math.max(run,e.e1)});
  const last=h[h.length-1],topLbl=ex.assist?'Effective load':'Top set';
  const pts=h.slice(-24).map(e=>({lbl:fmtDate(e.wk.date),y:e.top?r1(e.top.L):0,y2:r1(e.e1)}));
  const chart=pts.length>1?lineChart(pts,`${ex.name}: ${topLbl.toLowerCase()} and estimated 1RM over time`):'';
  return `<div class="sx"><div class="sx-pad">${head}
    <div class="kpis">
      <div class="kpi"><span>Best est. 1RM</span><b>${best?r1(best):'–'}<small>${best?u:''}</small></b></div>
      <div class="kpi"><span>${ex.assist?'Best effective load':'Heaviest set'}</span><b>${heavy&&heavy.L?r1(heavy.L):'–'}<small>${heavy&&heavy.L?`${u} × ${heavy.R}`:''}</small></b></div>
      <div class="kpi"><span>Sessions</span><b>${h.length}</b></div>
      <div class="kpi"><span>Last trained</span><b class="sm">${relDays(last.wk.date)}</b></div>
    </div>
    ${ex.assist?'<p class="first-log mt-s">Effective load = body weight minus assistance.</p>':''}
    ${chart?`<div class="card flat"><div class="card-h"><b>Progress</b><span class="card-s"><i class="lg-l"></i>${topLbl}<i class="lg-l d"></i>Est. 1RM</span></div>${chart}</div>`:''}
    <p class="h3 mt">All sessions</p><div class="xh-list">${histRows(h.slice().reverse(),ex)}</div>
  </div></div>`;
}
function wSheet(id){
  const w=Store.get(id);if(!w)return `<div class="sx"><div class="sx-pad"><p class="first-log">This workout no longer exists.</p></div></div>`;
  const st=wStats(w),d=DAY[w.day],dt=parseISO(w.date),u=S.unit,base=cur.base;
  const fresh=w.finishedAt&&Date.now()-w.finishedAt<10*60000;
  const ex=w.items.map((it,i)=>{const e=EX[it.ex];if(!e)return'';const ds=it.sets.filter(s=>s.d);
    return `<div class="wx${ds.length?'':' skip'}"><span class="wx-n">${i+1}</span><div class="ex-main"><a class="wx-name" href="#/${base}/x/${it.ex}">${e.name}${IC.chev}</a><div class="set-chips">${ds.length?ds.map(s=>`<span>${setTxt(s,e)}</span>`).join(''):'<small>Skipped</small>'}</div></div></div>`}).join('');
  return `<div class="sx"><div class="sx-pad">
    <p class="eyebrow">${fresh?'Workout complete':dt.toLocaleDateString(locale(),{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</p>
    <h2 class="sx-title">${d?d.title:'Workout'}</h2>
    <p class="sub">${d?d.focus:''}${w.startedAt?` · ${tm(w.startedAt)}${w.finishedAt?' – '+tm(w.finishedAt):''}`:''}</p>
    <div class="kpis mt-s">
      <div class="kpi"><span>Duration</span><b>${fmtDur(st.dur)}</b></div>
      <div class="kpi"><span>Calories (est.)</span><b>${fmtInt(st.kcal)}<small>kcal</small></b></div>
      <div class="kpi"><span>Volume</span><b>${fmtK(st.vol)}<small>${u}</small></b></div>
      <div class="kpi"><span>Sets</span><b>${st.sets}</b></div>
    </div>
    <p class="h3 mt">Exercises</p><div class="wx-list">${ex}</div>
    <p class="h3 mt">Duration</p><p class="first-log">Forgot to tap Finish? Correct the duration here and calories update automatically.</p>
    <div class="dur-edit"><label class="fld"><input type="text" inputmode="numeric" id="durIn" value="${st.dur}" aria-label="Duration in minutes"><em>min</em></label><button class="ghost press" data-act="savedur" data-id="${esc(w.id)}">Save</button></div>
    ${w.id===todayId(w.day)&&d&&base==='history'?`<a class="btn-secondary press mt" href="#/${w.day}">Open workout${IC.chev}</a>`:''}
    <button class="danger press mt" data-act="delw" data-id="${esc(w.id)}">${IC.trash} Delete workout</button>
  </div></div>`;
}
const stepper=k=>`<div class="stp"><button data-act="step" data-k="${k}" data-d="-15" aria-label="Decrease">${IC.minus}</button><span class="stp-v" aria-live="polite">${fmt(S[k])}</span><button data-act="step" data-k="${k}" data-d="15" aria-label="Increase">${IC.plus}</button></div>`;
const swHTML=k=>`<button class="sw${S[k]?' on':''}" data-act="toggle" data-k="${k}" role="switch" aria-checked="${!!S[k]}"><i></i></button>`;
const bwTxt=()=>S.unit==='kg'?`${S.bw.toFixed(1)} kg`:`${Math.round(S.bw*2.20462)} lb`;
function syncText(){
  if(!Sync.configured)return 'Cloud setup is not finished yet.';
  if(!Sync.token())return 'This device is not connected yet.';
  if(Sync.status==='error')return 'Could not connect — check the sync code or internet.';
  if(Sync.q.length)return `${Sync.q.length} change${Sync.q.length>1?'s':''} waiting to sync`;
  return Sync.last?`Last synced ${relTime(Sync.last)}`:'Sync code saved on this device';
}
function settingsSheet(){
  const ok='wakeLock' in navigator;
  return `<div class="sx"><div class="sx-pad"><p class="eyebrow">Preferences</p><h2 class="sx-title">Settings</h2>
    <div class="srow"><span><b>Body weight</b><small>Used for calories and assisted-exercise load</small></span><div class="stp"><button data-act="bw" data-d="-1" aria-label="Decrease">${IC.minus}</button><span class="stp-v w" id="bwV" aria-live="polite">${bwTxt()}</span><button data-act="bw" data-d="1" aria-label="Increase">${IC.plus}</button></div></div>
    <div class="srow"><span><b>Weight unit</b><small>Label only, numbers aren't converted</small></span>
      <div class="seg sm" style="--v:${S.unit==='kg'?0:1}"><i class="pill"></i><button data-act="unit" data-v="kg" class="${S.unit==='kg'?'on':''}" aria-pressed="${S.unit==='kg'}">kg</button><button data-act="unit" data-v="lb" class="${S.unit==='lb'?'on':''}" aria-pressed="${S.unit==='lb'}">lb</button></div></div>
    <div class="srow"><span><b>Compound rest</b><small>Plan: 2–3 min</small></span>${stepper('restC')}</div>
    <div class="srow"><span><b>Isolation rest</b><small>Plan: 60–90 s</small></span>${stepper('restI')}</div>
    <div class="srow"><span><b>Timer sound</b><small>Beep when rest is over</small></span>${swHTML('sound')}</div>
    <div class="srow"><span><b>Keep screen awake</b><small>${ok?'Stops your phone dimming mid-workout':'Not supported in this browser'}</small></span>${swHTML('wake')}</div>
    <div class="srow"><span><b>Cloud sync</b><small id="syncTxt">${syncText()}</small></span>${Sync.on?`<button class="ghost press sm-btn" data-act="sync">Sync now</button>`:`<span class="badge">${IC.cloud}${Sync.configured?'Connect':'Setup'}</span>`}</div>
    <div class="cloud-sync">
      ${!Sync.configured?`<p><b>Cloud setup needed</b></p><p>Finish the setup in Supabase, then enter the public Project URL and Publishable key in <code>cloud-config.js</code>. Your existing workout data stays on this device.</p>`:!Sync.token()?`<p><b>Connect this device</b></p><p>Enter the same private sync code on your phone and computer. No email or account is needed.</p><label for="syncCode">Private sync code</label><input class="cloud-input" id="syncCode" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Paste your private sync code" maxlength="200"><button class="btn-primary press cloud-connect" data-act="cloud-connect">Connect this device</button><p class="cloud-msg" id="cloudMsg" aria-live="polite">The code is saved only in this browser. Keep it private.</p>`:`<p><b>Cloud sync is enabled on this device</b></p><p>Workout history stays local too. Disconnecting only removes this device's saved code; it does not delete cloud data.</p><div class="cloud-actions"><button class="ghost press" data-act="sync">${IC.refresh} Sync now</button><button class="ghost press" data-act="cloud-disconnect">Disconnect device</button></div><p class="cloud-msg" id="cloudMsg" aria-live="polite">${Sync.status==='error'?'Connection error. Check the code and internet.':'Use the same code on your other device.'}</p>`}
    </div>
    <div class="sbtns"><button class="ghost press" data-act="export">${IC.download} Back up</button><button class="ghost press" data-act="import">${IC.upload} Restore</button></div>
    <input type="file" id="importFile" accept="application/json,.json" hidden>
    <button class="danger press" data-act="wipe">${IC.trash} Delete all workout history</button>
    <p class="fine">Until sync is connected, your data lives only on this device, so back up now and then. Exercise images from free-exercise-db (public domain).</p>
  </div></div>`;
}
function rulesSheet(){
  const r=(ic,t,p)=>`<div class="rule"><span class="rule-ic">${ic}</span><div><b>${t}</b><p>${p}</p></div></div>`;
  return `<div class="sx"><div class="sx-pad"><p class="eyebrow">Program</p><h2 class="sx-title">Execution rules</h2>
    ${r(IC.flame,'Effort','Main compound lifts: stop with 1–2 reps in reserve (RIR). Isolation exercises: the last set can reach 0–1 RIR. Don\'t regularly take heavy compound lifts to complete failure.')}
    ${r(IC.clock,'Rest','Main compound lifts: 2–3 minutes. Isolation exercises: 60–90 seconds. The rest timer starts automatically when you tick off a set.')}
    ${r(IC.trend,'Progression','When you reach the top of the rep range on all sets, increase the weight slightly (or reduce the assistance on assisted pull-ups). The set log flags this for you next session.')}
    ${r(IC.abs,'Core training','Abs are built into the gym plan three times per week. Treat them like any other exercise: use controlled reps, progress the load or reps over time, and stop with about 1–2 clean reps in reserve.')}
    ${r(IC.info,'What RIR means','Reps in reserve: how many more clean reps you could have done. 2 RIR means you stopped with about two good reps left.')}
  </div></div>`;
}

/* ---------- Router ---------- */
const app=$('#app'),topbar=$('#topbar'),backBtn=$('#backBtn'),brand=$('#brand'),topTitle=$('#topTitle'),root=$('#sheetRoot'),sheet=$('#sheet'),sbody=$('#sheetBody'),timerEl=$('#timer'),dlg=$('#dlg');
backBtn.innerHTML=IC.back;$('#settingsBtn').innerHTML=IC.settings;$('#sheetClose').innerHTML=IC.x;$('#sheetBack').innerHTML=IC.back;$('#tX').innerHTML=IC.x;$('#brandMark').innerHTML=IC.dumbbell;$('#icProg').innerHTML=IC.dumbbell;$('#icHist').innerHTML=IC.chart;
applyLanguage();
root.inert=true; // a closed sheet must not be focusable

let cur={base:null,sheet:null},sheetOpen=false,sheetKey=null,curTab=0,lastFocus=null;
const scrollMem={},stack=[];let replacing=false,popTo=null;
const H=()=>location.hash&&location.hash!=='#'?location.hash:'#/';
function track(){
  const h=H();
  if(replacing){stack[stack.length-1]=h;replacing=false}
  else if(popTo!=null){stack.length=popTo+1;stack[popTo]=h;popTo=null}
  else if(stack.length>1&&stack[stack.length-2]===h)stack.pop();
  else if(stack[stack.length-1]!==h)stack.push(h);
}
function goUp(target,push){
  if(H()===target)return;
  const top=stack.length-1,k=stack.slice(0,top).lastIndexOf(target);
  if(k>=0){popTo=k;history.go(k-top)}
  else if(push)location.hash=target;
  else{replacing=true;location.replace(target)}
}
function parse(h=H()){
  const seg=h.replace(/^#\/?/,'').split('/').filter(Boolean).map(s=>{try{return decodeURIComponent(s)}catch(e){return s}});
  let base='home',rest=seg;
  if(seg[0]==='history'){base='history';rest=seg.slice(1)}
  else if(seg[0]&&DAY[seg[0]]){base=seg[0];rest=seg.slice(1)}
  const x=rest[0];let sh=null;
  if(x==='settings'||x==='rules')sh={t:x};
  else if(x==='w'&&rest[1]&&Store.get(rest[1]))sh={t:'w',id:rest[1]};
  else if(x==='x'&&rest[1]&&EX[rest[1]])sh={t:'x',id:rest[1]};
  else if(DAY[base]&&/^\d+$/.test(x||'')&&DAY[base].items[+x])sh={t:'ex',i:+x};
  return{base,sheet:sh};
}
const basePath=b=>b==='home'?'#/':'#/'+b;
function renderBase(base,dir,prevBase){
  if(prevBase)scrollMem[prevBase]=scrollY;
  const isDay=!!DAY[base];
  app.innerHTML=base==='home'?homeView():base==='history'?historyView():dayView(base);
  app.firstElementChild.classList.add(dir);
  backBtn.hidden=!isDay;brand.hidden=isDay;
  topTitle.textContent=isDay?`${DAY[base].day} · ${DAY[base].title}`:base==='history'?'History':'';
  document.title=isDay?`${DAY[base].title} · ${DAY[base].day}`:base==='history'?'History':'4-Day Program';
  $('#tabProg').classList.toggle('on',base!=='history');$('#tabHist').classList.toggle('on',base==='history');
  $('#tabProg').setAttribute('aria-current',base!=='history'?'page':'false');$('#tabHist').setAttribute('aria-current',base==='history'?'page':'false');
  window.scrollTo(0,isDay?0:(scrollMem[base]||0));
  onScroll();
  if(isDay)loadThumbs();
}
function refreshBase(){
  const y=scrollY;
  if(cur.base==='home'||cur.base==='history'){app.innerHTML=cur.base==='home'?homeView():historyView();app.firstElementChild.classList.add('static');window.scrollTo(0,y)}
  else updateDay(cur.base);
}
function restoreFocus(){
  const f=lastFocus;lastFocus=null;if(!f)return;
  let el=f.isConnected?f:null;
  if(!el&&f.getAttribute){const h=f.getAttribute('href');if(h)el=app.querySelector(`[href="${CSS.escape(h)}"]`)}
  if(el&&!sheet.contains(el)&&el.focus)el.focus({preventScroll:true});
}
function route(){
  const r=parse(),prev=cur;cur={base:r.base,sheet:r.sheet};
  if(r.base!==prev.base){const dep=b=>DAY[b]?1:0;renderBase(r.base,prev.base===null?'first':dep(r.base)>dep(prev.base)?'fwd':dep(r.base)<dep(prev.base)?'back':'first',prev.base)}
  if(r.sheet)return openSheet(r);
  if(sheetOpen){closeSheetUI();refreshBase()}
  else if(prev.sheet&&r.base===prev.base)refreshBase();
  restoreFocus();
}
function openSheet(r){
  const t=r.sheet.t,key=t==='ex'?`ex:${r.base}:${r.sheet.i}`:(t==='w'||t==='x')?`${t}:${r.sheet.id}`:t;
  if(sheetOpen&&key===sheetKey)return;
  const exSwap=sheetOpen&&t==='ex'&&(sheetKey||'').startsWith('ex:');
  const dir=exSwap?(r.sheet.i>+sheetKey.split(':')[2]?'fwd':'back'):(sheetOpen?'swap':'');
  if(t==='ex'&&!exSwap&&!(sheetKey||'').startsWith('x:'))curTab=dayProgress(r.base).done>0?1:0;
  stopMedia();
  sbody.innerHTML=t==='ex'?exSheet(r.base,r.sheet.i,curTab):t==='settings'?settingsSheet():t==='rules'?rulesSheet():t==='w'?wSheet(r.sheet.id):xSheet(r.sheet.id);
  sbody.scrollTop=0;
  if(dir)sbody.firstElementChild.classList.add(dir);
  sheetKey=key;
  const ph=stack[stack.length-2],pr=ph?parse(ph):null,canBack=!!(pr&&pr.sheet&&pr.base===r.base);
  $('#sheetBack').hidden=!canBack;sheet.classList.toggle('has-back',canBack&&t!=='ex');
  if(t==='ex')setupMedia(selectedEx(r.base,r.sheet.i));
  if(!sheetOpen){
    lastFocus=document.activeElement;
    sheetOpen=true;root.inert=false;root.setAttribute('aria-hidden','false');document.body.classList.add('lock');
    app.inert=true;topbar.inert=true;$('#tabbar').inert=true;
    requestAnimationFrame(()=>{root.classList.add('open');sheet.focus({preventScroll:true})});
  }
}
function closeSheetUI(){
  if(!sheetOpen)return;
  sheetOpen=false;sheetKey=null;stopMedia();
  if(document.activeElement&&sheet.contains(document.activeElement))document.activeElement.blur();
  root.classList.remove('open');root.setAttribute('aria-hidden','true');root.inert=true;document.body.classList.remove('lock');
  app.inert=false;topbar.inert=false;$('#tabbar').inert=false;
}
function requestClose(){closeSheetUI();goUp(basePath(cur.base))} // route() refreshes the base once the hash changes
function navEx(j){replacing=true;location.replace(`#/${cur.base}/${j}`)}

/* ---------- Actions ---------- */
function ctx(){const day=cur.base,i=cur.sheet.i,it=DAY[day].items[i],exId=selectedEx(day,i);return{day,i,it,exId,ex:EX[exId]}}
function setTab(v){
  curTab=v;
  const sx=$('.sx',sbody),seg=$('.seg',sbody);
  sx.classList.toggle('log',v===1);seg.style.setProperty('--v',v);
  $$('button',seg).forEach(b=>{const on=+b.dataset.v===v;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
  $$('.panel',sbody).forEach((p,k)=>{p.hidden=k!==v;if(k===v){p.classList.remove('in');void p.offsetWidth;p.classList.add('in')}});
}
function checkComplete(key){
  const p=dayProgress(key);if(p.done<p.total)return false;
  toast('All sets done. Tap Finish workout to save it.');
  return true;
}
function startWorkout(key){const w=Store.ensure(key);if(!w.startedAt){w.startedAt=Date.now();w.finishedAt=null;Store.touch(w,true)}}
async function finishWorkout(key){
  const w=todayW(key),p=dayProgress(key);
  if(!w||!hasActivity(w)){toast('Log at least one set first');return}
  if(p.done<p.total&&!(await ask(`Finish with ${p.done} of ${p.total} sets done?`,'Finish')))return;
  if(!w.startedAt)w.startedAt=Date.now()-60000;
  w.finishedAt=Date.now();w.bw=S.bw;Store.touch(w,true);hideTimer();haptic([20,60,20]);
  location.hash=`#/${key}/w/${w.id}`;
}
function toggleSet(k,btn){
  const{day,i,it,exId,ex}=ctx(),w=Store.ensure(day),s=w.items[i],set=s.sets[k],row=btn.closest('.set-row'),src=`${w.id}:${i}:${k}`;
  set.d=!set.d;set.t=set.d?Date.now():null;
  if(set.d){
    const wi=$('[data-f="w"]',row),ri=$('[data-f="r"]',row);
    if(!set.w&&wi.dataset.p){set.w=normNum(wi.dataset.p);wi.value=set.w}
    if(!set.r&&ri.dataset.p){set.r=normNum(ri.dataset.p);ri.value=set.r}
    if(set.w)propagateWeight(k,set.w);
    if(!w.startedAt)w.startedAt=Date.now()-60000;
    if(w.finishedAt)w.finishedAt=null;
  }else if(!T.fired&&T.src===src)hideTimer(); // unticking cancels the rest it started
  Store.touch(w,true);
  row.classList.toggle('done',set.d);btn.setAttribute('aria-pressed',set.d);
  const n=doneCount(day,i),all=n>=it.sets;
  $('#logCnt').textContent=`${n}/${it.sets}`;
  const nb=$('.nav-btn.nx',sbody);if(nb)nb.classList.toggle('go',all);
  updateDay(day);
  if(set.d){
    haptic(12);unlockAudio();
    const W=num(set.w),R=num(set.r),c1=e1(load(ex,set.w,w.bw),R);
    let pr=false;
    if(c1>0){
      const before=Math.max(0,...exHistory(exId,w.id).map(e=>e.e1));
      const todayB=Math.max(0,...s.sets.filter(x=>x!==set&&x.d).map(x=>e1(load(ex,x.w,w.bw),num(x.r))));
      pr=before>0&&c1>before&&c1>todayB;
    }
    const nxt=DAY[day].items[i+1];
    startTimer(restFor(it,exId),it.ss&&nxt&&nxt.ss===it.ss?`Superset: go to ${EX[selectedEx(day,i+1)].name}`:all?'Rest · next exercise':`Rest · then set ${n+1} of ${it.sets}`,src);
    if(pr){toast(ex.assist?`New PR · ${R} reps ${W?`with ${r1(W)} ${S.unit} assist`:'at bodyweight'}`:`New PR · ${r1(W)} ${S.unit} × ${R} on ${ex.name}`);haptic([30,60,30,60,30])}
    else if(all&&!checkComplete(day))toast(`${ex.name} complete`);
  }
}
function propagateWeight(k,val){
  $$('[data-f="w"]',sbody).forEach(inp=>{const j=+inp.dataset.s;if(j>k&&!inp.value){const v=val||inp.dataset.p0||'';inp.placeholder=v||'–';inp.dataset.p=v}});
}
function exportData(){
  Store.flush();
  const blob=new Blob([JSON.stringify({app:'mytraining',v:3,exportedAt:new Date().toISOString(),workouts:Store.W,settings:S})],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`workout-backup-${iso()}.json`;
  document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);
  toast('Backup downloaded');
}
function importData(file){
  if(file.size>20*1024*1024){toast('That file is too large to be a backup');return}
  const rd=new FileReader();
  rd.onload=()=>{
    try{
      const d=JSON.parse(rd.result);
      if(!d||d.app!=='mytraining')throw new Error();
      if(d.workouts&&typeof d.workouts==='object')Store.merge(d.workouts,true);
      else if(d.log)migrateLegacy(d.log,d.abs);
      else throw new Error();
      if(d.settings){Object.assign(S,cleanS(Object.assign({},S,d.settings)));Store.saveS()}
      Object.values(Store.W).forEach(w=>{if(hasActivity(w)||w.deleted)Store.dirty.add(w.id)});
      Store.ver++;Store.flush();
      sbody.innerHTML=settingsSheet();toast('Backup restored');
    }catch(e){toast("That file isn't a valid backup")}
  };
  rd.readAsText(file);
}

root.addEventListener('click',async e=>{
  const el=e.target.closest('[data-act]');if(!el)return;
  const a=el.dataset.act;
  if(a==='close')return requestClose();
  if(a==='sback')return history.back();
  if(a==='tab')return setTab(+el.dataset.v);
  if(a==='check')return toggleSet(+el.dataset.s,el);
  if(a==='nav')return navEx(+el.dataset.to);
  if(a==='choose-ex'){
    const{day,i,it}=ctx(),id=el.dataset.ex;if(!validOption(day,i,id))return;
    const old=selectedEx(day,i);if(id===old)return;
    const current=session(day,i),hasEntered=!!(current&&current.sets.some(x=>x.d||x.w||x.r));
    if(hasEntered&&!(await ask(`Switch to ${EX[id].name}? The sets entered for ${EX[old].name} in today's slot will be cleared.`,`Switch exercise`,true)))return;
    S.choices=S.choices||{};S.choices[slotKey(day,i)]=id;Store.saveS();
    if(current){current.ex=id;current.slot=slotKey(day,i);current.sets=Array.from({length:it.sets},()=>({w:'',r:'',d:false,t:null}));const w=todayW(day);if(w)Store.touch(w,true)}
    stopMedia();sbody.innerHTML=exSheet(day,i,curTab);setupMedia(id);updateDay(day);toast(`${EX[id].name} selected`);return;
  }
  if(a==='rest'){const{it,exId,ex}=ctx();unlockAudio();return startTimer(restFor(it,exId),'Rest · '+ex.name)}
  if(a==='unit'){S.unit=el.dataset.v==='lb'?'lb':'kg';Store.saveS();const seg=el.parentElement;seg.style.setProperty('--v',S.unit==='kg'?0:1);$$('button',seg).forEach(b=>{const on=b.dataset.v===S.unit;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});$('#bwV').textContent=bwTxt();return}
  if(a==='bw'){const step=S.unit==='kg'?.5:.45359237;S.bw=Math.round(Math.min(250,Math.max(30,S.bw+ +el.dataset.d*step))*100)/100;Store.saveS();$('#bwV').textContent=bwTxt();return}
  if(a==='step'){const k=el.dataset.k,lo=k==='restC'?60:30,hi=k==='restC'?300:180;S[k]=Math.min(hi,Math.max(lo,S[k]+ +el.dataset.d));Store.saveS();$('.stp-v',el.parentElement).textContent=fmt(S[k]);return}
  if(a==='toggle'){const k=el.dataset.k;S[k]=!S[k];Store.saveS();el.classList.toggle('on',S[k]);el.setAttribute('aria-checked',S[k]);if(k==='wake')applyWake();if(k==='sound'&&S.sound){unlockAudio();beep()}return}
  if(a==='cloud-connect'){
    const input=$('#syncCode',sbody),msg=$('#cloudMsg',sbody),code=input?input.value:'';
    if(!code.trim()){if(msg)msg.textContent='Paste your private sync code first.';return}
    el.disabled=true;el.textContent='Connecting…';if(msg)msg.textContent='Checking the code and downloading your cloud data…';
    try{await Sync.connect(code);sbody.innerHTML=settingsSheet();toast('Cloud sync connected on this device');}
    catch(err){Sync.status='error';if(msg)msg.textContent=String(err&&err.message||'Could not connect. Check the code and internet.').slice(0,220);el.disabled=false;el.textContent='Try again';}
    return;
  }
  if(a==='cloud-disconnect'){
    if(!(await ask('Disconnect cloud sync on this device? Your local and cloud workout data will not be deleted.','Disconnect')))return;
    LS.set('mytraining.token','');Sync.status='idle';sbody.innerHTML=settingsSheet();toast('This device disconnected; workout data kept');return;
  }
  if(a==='sync'){$('#syncTxt').textContent='Syncing…';const ok=await Sync.pull();if(ok)await Sync.flush();const st=$('#syncTxt');if(st)st.textContent=syncText();const m=$('#cloudMsg',sbody);if(m)m.textContent=ok?'Sync check completed.':'Could not sync; check the code and internet.';return}
  if(a==='export')return exportData();
  if(a==='import')return $('#importFile',sbody).click();
  if(a==='savedur'){
    const w=Store.get(el.dataset.id),v=parseInt(normNum($('#durIn',sbody).value),10);if(!w)return;
    if(!(v>0&&v<=600)){toast('Enter minutes between 1 and 600');return}
    w.durOverride=v;Store.touch(w,true);sbody.innerHTML=wSheet(w.id);toast('Duration saved');return;
  }
  if(a==='delw'){
    if(!(await ask('Delete this workout from your history?','Delete',true)))return;
    if(!T.fired&&T.src&&T.src.startsWith(el.dataset.id+':'))hideTimer();
    Store.remove(el.dataset.id);toast('Workout deleted');return requestClose();
  }
  if(a==='wipe'){
    if(!(await ask('Delete all workout history? Back up first if you might want it later.','Delete all',true)))return;
    const now=Date.now();
    Object.values(Store.W).forEach(w=>{if(!w.deleted){w.deleted=true;w.updatedAt=now;Store.dirty.add(w.id)}});
    Store.ver++;Store.flush();hideTimer();toast('History deleted');
  }
});
root.addEventListener('change',e=>{if(e.target.id==='importFile'&&e.target.files[0]){importData(e.target.files[0]);e.target.value=''}});
root.addEventListener('input',e=>{
  const f=e.target.dataset.f;if(!f||!cur.sheet||cur.sheet.t!=='ex')return;
  const{day,i}=ctx(),w=Store.ensure(day),k=+e.target.dataset.s;
  const val=normNum(e.target.value.trim()).slice(0,f==='w'?7:4);
  if(val!==e.target.value)e.target.value=val; // Persian digits / comma → ASCII as you type
  w.items[i].sets[k][f]=val;Store.touch(w);     // debounced save
  if(f==='w')propagateWeight(k,val);
});
root.addEventListener('keydown',e=>{
  if(e.key!=='Enter'||e.target.tagName!=='INPUT')return;
  e.preventDefault();
  if(e.target.dataset.f==='w'){const r=$('[data-f="r"]',e.target.closest('.set-row'));if(r)return r.focus()}
  e.target.blur();
});

function selectBar(hit){
  const k=+hit.dataset.k;HV.sel=HV.sel===k?null:k;
  $$('.bar',hit.closest('svg')).forEach(b=>b.classList.toggle('dim',HV.sel!=null&&+b.dataset.k!==HV.sel));
  $('#chartCap',app).innerHTML=capHTML();
}
app.addEventListener('click',e=>{
  const hit=e.target.closest('.hit');
  if(hit)return selectBar(hit);
  const el=e.target.closest('[data-act]');if(!el)return;
  const key=cur.base,a=el.dataset.act;
  if(a==='finish')finishWorkout(key);
  if(a==='reset'){
    const w=todayW(key);
    if(!w){toast('Nothing logged today');return}
    ask(`Clear today's log for ${DAY[key].title}?`,'Clear',true).then(ok=>{
      if(!ok)return;
      if(!T.fired&&T.src&&T.src.startsWith(w.id+':'))hideTimer();
      Store.remove(w.id);updateDay(key);toast("Today's log cleared");
    });
  }
  if(a==='range'){HV.range=el.dataset.v;HV.off=0;HV.sel=null;updateHistory()}
  if(a==='poff'){HV.off=Math.min(0,HV.off+ +el.dataset.d);HV.sel=null;updateHistory()}
  if(a==='metric'){HV.metric=el.dataset.v;HV.sel=null;$('#chartBox',app).innerHTML=chartBox()}
  if(a==='tomonth'){HV.range='month';HV.off=+el.dataset.off;HV.sel=null;updateHistory();window.scrollTo({top:0,behavior:RM?'auto':'smooth'})}
});
app.addEventListener('keydown',e=>{
  const hit=e.target.closest&&e.target.closest('.hit');
  if(hit&&(e.key==='Enter'||e.key===' ')){e.preventDefault();selectBar(hit)}
});

/* Tabs and the "Start workout" link */
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="#/"]');if(!a)return;
  if(a.dataset.tab){
    e.preventDefault();
    const t=a.dataset.tab,target=t==='#/'?'home':'history';
    if(cur.base===target&&!cur.sheet){window.scrollTo({top:0,behavior:RM?'auto':'smooth'});return}
    goUp(t,true);return;
  }
  if(a.dataset.act==='start'&&DAY[cur.base])startWorkout(cur.base);
});

backBtn.addEventListener('click',()=>{if(stack.length>1)history.back();else{replacing=true;location.replace('#/')}});
$('#settingsBtn').addEventListener('click',()=>{location.hash=cur.base==='home'?'#/settings':cur.base==='history'?'#/history/settings':`#/${cur.base}/settings`});
$('#langBtn').addEventListener('click',()=>{S.lang=isFA()?'en':'fa';Store.saveS();location.reload()});

function onScroll(){topbar.classList.toggle('scrolled',scrollY>60)}
addEventListener('scroll',onScroll,{passive:true});

if(dlg)dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close('cancel')});
addEventListener('keydown',e=>{
  if(dlg&&dlg.open)return; // the dialog handles its own Escape
  if(!sheetOpen)return;
  if(e.key==='Escape')return requestClose();
  if(cur.sheet&&cur.sheet.t==='ex'&&document.activeElement.tagName!=='INPUT'){
    const n=DAY[cur.base].items.length;
    if(e.key==='ArrowRight'&&cur.sheet.i<n-1)navEx(cur.sheet.i+1);
    if(e.key==='ArrowLeft'&&cur.sheet.i>0)navEx(cur.sheet.i-1);
  }
});

/* Swipe down to close (mobile) */
let drag=null;
sheet.addEventListener('touchstart',e=>{
  if(innerWidth>=720||e.target.closest('input,.sx-nav'))return;
  if(sbody.scrollTop>0&&!e.target.closest('.grab'))return;
  drag={y:e.touches[0].clientY,dy:0,t:Date.now()};
},{passive:true});
sheet.addEventListener('touchmove',e=>{
  if(!drag)return;
  const dy=e.touches[0].clientY-drag.y;
  if(dy<0&&drag.dy===0){drag=null;return}
  drag.dy=Math.max(0,dy);
  if(drag.dy>6){e.preventDefault();sheet.classList.add('dragging');sheet.style.transform=`translateY(${drag.dy}px)`}
},{passive:false});
sheet.addEventListener('touchend',()=>{
  if(!drag)return;
  const{dy,t}=drag;drag=null;
  const v=dy/Math.max(1,Date.now()-t);
  sheet.classList.remove('dragging');sheet.style.transform='';
  if(dy>130||(v>.6&&dy>40))requestClose();
});

/* ---------- Rest timer (survives reloads and app kills) ---------- */
const T={end:0,dur:1,iv:0,fired:true,hideTo:0,src:null,label:''};
const C40=2*Math.PI*16;
let actx=null;
function unlockAudio(){try{actx=actx||new(window.AudioContext||window.webkitAudioContext)();if(actx.state==='suspended')actx.resume()}catch(e){}}
function beep(){
  if(!actx)return;
  const t=actx.currentTime;
  [0,.24,.48].forEach((o,j)=>{
    const osc=actx.createOscillator(),g=actx.createGain();
    osc.type='sine';osc.frequency.value=j===2?1320:880;
    g.gain.setValueAtTime(.0001,t+o);g.gain.exponentialRampToValueAtTime(.3,t+o+.02);g.gain.exponentialRampToValueAtTime(.0001,t+o+.2);
    osc.connect(g).connect(actx.destination);osc.start(t+o);osc.stop(t+o+.22);
  });
}
function saveTimer(){LS.set('mytraining.timer',T.fired?null:{end:T.end,dur:T.dur,label:T.label,src:T.src})}
function runTimer(end,dur,label,src){
  clearTimeout(T.hideTo);clearInterval(T.iv);
  Object.assign(T,{end,dur,label,src:src||null,fired:false});
  $('#tLabel').textContent=label;
  timerEl.classList.remove('done');timerEl.classList.add('show');document.body.classList.add('timing');
  saveTimer();
  T.iv=setInterval(tick,250);tick();
}
function startTimer(sec,label,src){runTimer(Date.now()+sec*1000,sec,label,src)}
function tick(){
  if(T.fired)return;
  const left=Math.max(0,T.end-Date.now());
  $('#tTime').textContent=fmt(Math.ceil(left/1000));
  $('#tFg').style.strokeDashoffset=(C40*(1-left/(T.dur*1000))).toFixed(2);
  if(left<=0){
    T.fired=true;clearInterval(T.iv);saveTimer();
    timerEl.classList.add('done');$('#tLabel').textContent='Rest over. Next set.';
    haptic([220,120,220]);if(S.sound)beep();
    T.hideTo=setTimeout(hideTimer,6000);
  }
}
function hideTimer(){clearInterval(T.iv);clearTimeout(T.hideTo);T.fired=true;T.src=null;saveTimer();timerEl.classList.remove('show','done');document.body.classList.remove('timing')}
timerEl.addEventListener('click',e=>{
  const b=e.target.closest('[data-t]');if(!b)return;
  const v=b.dataset.t;
  if(v==='x')return hideTimer();
  const d=+v;
  if(T.fired){if(d>0)startTimer(d,'Extra rest');return}
  T.end=Math.max(Date.now(),T.end+d*1000);T.dur=Math.max(1,T.dur+d);saveTimer();tick();
});

/* ---------- Screen wake lock ---------- */
let wl=null;
async function applyWake(){
  try{
    if(S.wake&&document.visibilityState==='visible'&&'wakeLock' in navigator){
      if(!wl){wl=await navigator.wakeLock.request('screen');wl.addEventListener('release',()=>{wl=null})}
    }else if(wl){await wl.release();wl=null}
  }catch(e){}
}

/* ---------- Init ---------- */
if('scrollRestoration' in history)history.scrollRestoration='manual';
addEventListener('hashchange',()=>{track();route()});
addEventListener('online',()=>{Sync.flush();Sync.pull()});
addEventListener('pagehide',()=>Store.flush());
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden'){Store.flush();return}
  applyWake();
  if(!T.fired)tick();
  if(!sheetOpen)refreshBase(); // picks up date changes (e.g. after midnight)
});
/* Another tab changed the data */
addEventListener('storage',e=>{
  if(e.key==='mytraining.workouts'){if(Store.merge(LS.get('mytraining.workouts',{}))&&!sheetOpen)refreshBase()}
  else if(e.key==='mytraining.settings'){Object.assign(S,cleanS(LS.get('mytraining.settings',{})));Store.ver++;if(!sheetOpen)refreshBase()}
});
setInterval(()=>{
  const el=$('#elapsed');if(!el||!DAY[cur.base])return;
  const w=todayW(cur.base);
  if(w&&w.startedAt)el.textContent='In progress · '+fmtDur((Date.now()-w.startedAt)/60000);
},20000);
stack.push(H());
route();
applyWake();
(()=>{const st=LS.get('mytraining.timer',null);if(st&&+st.end>Date.now()+500)runTimer(+st.end,+st.dur||1,String(st.label||'Rest'),st.src);else LS.set('mytraining.timer',null)})();
if(Sync.on){
  Sync.pull().then(ok=>{if(ok)Sync.flush()});
}
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(e=>console.warn('SW registration failed',e)));
window.GymApp={Store,Sync,CONFIG};