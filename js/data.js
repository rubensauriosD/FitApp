/**
 * data.js — All static data: recipes, exercise routines, default pantry items.
 */

// ─── RECIPES ────────────────────────────────────────────────────────────────
// Ingredients are objects: { name: string, amount: string }

const RECIPES = [

  // ── DESAYUNO ─────────────────────────────────────────────────────────────

  {
    id: 1, name: 'Avena con leche y banana',
    type: ['desayuno'],
    calories: 380, protein: 15, carbs: 65, fat: 8,
    ingredients: [
      { name: 'avena', amount: '80g' },
      { name: 'leche', amount: '250ml' },
      { name: 'banana', amount: '1 mediana' },
      { name: 'miel', amount: '1 cdita' },
      { name: 'canela', amount: 'a gusto' }
    ],
    instructions: 'Calentar la leche en una cacerola. Agregar la avena y cocinar a fuego medio revolviendo 5 minutos hasta espesar. Servir en un bowl con la banana cortada en rodajas y un hilo de miel. Espolvorear canela.',
    prepTime: 10
  },
  {
    id: 2, name: 'Huevos revueltos con tostadas integrales',
    type: ['desayuno'],
    calories: 350, protein: 22, carbs: 30, fat: 14,
    ingredients: [
      { name: 'huevos', amount: '3 unidades' },
      { name: 'pan integral', amount: '2 rebanadas' },
      { name: 'manteca', amount: '1 cdita' },
      { name: 'sal y pimienta', amount: 'a gusto' },
      { name: 'cebolla de verdeo', amount: '1 cda (opcional)' }
    ],
    instructions: 'Batir los huevos con sal y pimienta. Derretir la manteca en sartén a fuego bajo, agregar los huevos y revolver suavemente sin dejar de mover hasta que estén cocidos pero cremosos. Servir sobre las tostadas.',
    prepTime: 8
  },
  {
    id: 3, name: 'Yogurt con granola y fruta',
    type: ['desayuno'],
    calories: 320, protein: 18, carbs: 45, fat: 8,
    ingredients: [
      { name: 'yogurt natural', amount: '200g' },
      { name: 'granola', amount: '40g' },
      { name: 'banana', amount: '½ unidad' },
      { name: 'frutillas o arándanos', amount: 'handful' },
      { name: 'miel', amount: '1 cdita' }
    ],
    instructions: 'En un bowl colocar el yogurt. Agregar la granola, la fruta cortada y finalizar con la miel. Servir inmediatamente para mantener el crunch de la granola.',
    prepTime: 5
  },
  {
    id: 4, name: 'Tostadas con palta y huevo pochado',
    type: ['desayuno'],
    calories: 420, protein: 18, carbs: 35, fat: 22,
    ingredients: [
      { name: 'pan integral', amount: '2 rebanadas' },
      { name: 'palta', amount: '½ unidad' },
      { name: 'huevos', amount: '2 unidades' },
      { name: 'limón', amount: 'unas gotas' },
      { name: 'sal y pimienta', amount: 'a gusto' },
      { name: 'vinagre blanco', amount: '1 cda' }
    ],
    instructions: 'Tostar el pan. Pisas la palta con limón, sal y pimienta. Pochear los huevos en agua con vinagre durante 3 minutos. Untar el pan con la palta y colocar el huevo encima.',
    prepTime: 12
  },
  {
    id: 5, name: 'Licuado de banana y avena',
    type: ['desayuno'],
    calories: 380, protein: 12, carbs: 70, fat: 6,
    ingredients: [
      { name: 'banana', amount: '1 grande' },
      { name: 'avena', amount: '4 cdas' },
      { name: 'leche', amount: '300ml' },
      { name: 'miel', amount: '1 cdita' },
      { name: 'canela', amount: 'pizca' }
    ],
    instructions: 'Colocar todos los ingredientes en la licuadora. Procesar hasta obtener una mezcla homogénea. Servir frío. Ideal para tomar antes del entreno.',
    prepTime: 5
  },
  {
    id: 6, name: 'Omelette de vegetales',
    type: ['desayuno'],
    calories: 280, protein: 20, carbs: 8, fat: 18,
    ingredients: [
      { name: 'huevos', amount: '3 unidades' },
      { name: 'pimiento rojo', amount: '½ unidad' },
      { name: 'cebolla', amount: '¼ unidad' },
      { name: 'tomate', amount: '½ unidad' },
      { name: 'aceite de oliva', amount: '1 cdita' },
      { name: 'sal y pimienta', amount: 'a gusto' }
    ],
    instructions: 'Rehogar los vegetales picados en aceite 3 minutos. Batir los huevos con sal. Verter sobre los vegetales y cocinar a fuego medio sin revolver. Cuando esté casi firme, doblar a la mitad.',
    prepTime: 12
  },
  {
    id: 7, name: 'Panqueques de avena con miel',
    type: ['desayuno'],
    calories: 350, protein: 14, carbs: 58, fat: 8,
    ingredients: [
      { name: 'avena', amount: '100g' },
      { name: 'huevos', amount: '2 unidades' },
      { name: 'leche', amount: '100ml' },
      { name: 'miel', amount: '2 cdas' },
      { name: 'esencia de vainilla', amount: '½ cdita' }
    ],
    instructions: 'Procesar la avena hasta obtener harina. Mezclar con huevos, leche y vainilla hasta lograr una mezcla lisa. Cocinar porciones en sartén antiadherente a fuego medio 2 min por lado. Servir con miel.',
    prepTime: 15
  },
  {
    id: 8, name: 'Bowl de ricota con fruta y miel',
    type: ['desayuno'],
    calories: 290, protein: 20, carbs: 35, fat: 7,
    ingredients: [
      { name: 'ricota', amount: '200g' },
      { name: 'banana', amount: '½ unidad' },
      { name: 'frutillas o kiwi', amount: '100g' },
      { name: 'miel', amount: '1 cda' },
      { name: 'nueces', amount: '10g (opcional)' }
    ],
    instructions: 'Colocar la ricota en un bowl. Cortar la fruta en trozos y disponer sobre la ricota. Rociar con miel. Opcionalmente agregar nueces picadas para más proteína y textura.',
    prepTime: 5
  },
  {
    id: 9, name: 'Tostadas francesas proteicas',
    type: ['desayuno'],
    calories: 360, protein: 18, carbs: 42, fat: 12,
    ingredients: [
      { name: 'pan integral', amount: '2 rebanadas gruesas' },
      { name: 'huevos', amount: '2 unidades' },
      { name: 'leche', amount: '3 cdas' },
      { name: 'canela', amount: 'pizca' },
      { name: 'miel', amount: '1 cda' },
      { name: 'manteca', amount: '1 cdita' }
    ],
    instructions: 'Batir huevos con leche y canela. Sumergir el pan en la mezcla hasta que absorba. Cocinar en sartén con manteca a fuego medio-bajo, 2-3 minutos por lado hasta dorar. Servir con miel.',
    prepTime: 12
  },
  {
    id: 10, name: 'Tostadas con queso untable y mate cocido',
    type: ['desayuno'],
    calories: 240, protein: 12, carbs: 28, fat: 8,
    ingredients: [
      { name: 'pan integral', amount: '2 rebanadas' },
      { name: 'queso untable', amount: '40g' },
      { name: 'mermelada diet', amount: '1 cda (opcional)' }
    ],
    instructions: 'Tostar el pan a gusto. Untar con queso untable. Opcionalmente agregar una fina capa de mermelada diet. Acompañar con mate cocido sin azúcar.',
    prepTime: 5
  },

  // ── ALMUERZO ─────────────────────────────────────────────────────────────

  {
    id: 11, name: 'Pollo a la plancha con arroz integral y ensalada',
    type: ['almuerzo'],
    calories: 520, protein: 45, carbs: 55, fat: 10,
    ingredients: [
      { name: 'pollo', amount: '200g pechuga' },
      { name: 'arroz integral', amount: '80g' },
      { name: 'lechuga', amount: '2 hojas grandes' },
      { name: 'tomate', amount: '1 unidad' },
      { name: 'aceite de oliva', amount: '1 cda' },
      { name: 'limón', amount: '½' },
      { name: 'ajo', amount: '1 diente' },
      { name: 'sal y pimienta', amount: 'a gusto' }
    ],
    instructions: 'Cocinar el arroz según indicaciones. Marinar el pollo con ajo, limón, sal y pimienta. Cocinar en sartén caliente 5-6 minutos por lado hasta dorar. Dejar reposar 2 minutos antes de cortar. Servir con arroz y ensalada fresca.',
    prepTime: 30
  },
  {
    id: 12, name: 'Milanesa de pollo al horno con ensalada',
    type: ['almuerzo'],
    calories: 480, protein: 42, carbs: 35, fat: 18,
    ingredients: [
      { name: 'pollo', amount: '200g (aplanada)' },
      { name: 'pan rallado', amount: '50g' },
      { name: 'huevos', amount: '1 unidad' },
      { name: 'ajo en polvo', amount: '1 cdita' },
      { name: 'pimentón', amount: '1 cdita' },
      { name: 'lechuga', amount: 'a gusto' },
      { name: 'tomate', amount: 'a gusto' },
      { name: 'aceite de oliva', amount: '1 cdita' }
    ],
    instructions: 'Precalentar horno a 200°C. Pasar el pollo por huevo batido y luego por pan rallado mezclado con ajo y pimentón. Colocar en bandeja con papel de horno y rociar con aceite. Hornear 20-25 minutos dando vuelta a mitad. Servir con ensalada fresca.',
    prepTime: 30
  },
  {
    id: 13, name: 'Guiso de lentejas con verduras',
    type: ['almuerzo'],
    calories: 450, protein: 22, carbs: 65, fat: 8,
    ingredients: [
      { name: 'lentejas', amount: '150g' },
      { name: 'zanahoria', amount: '1 unidad' },
      { name: 'cebolla', amount: '1 unidad' },
      { name: 'tomate', amount: '2 unidades' },
      { name: 'ajo', amount: '2 dientes' },
      { name: 'pimentón ahumado', amount: '1 cdita' },
      { name: 'aceite de oliva', amount: '1 cda' },
      { name: 'sal y comino', amount: 'a gusto' }
    ],
    instructions: 'Rehogar cebolla y ajo en aceite hasta transparentar. Agregar zanahoria en cubos, tomate y especias. Incorporar las lentejas lavadas y cubrir con agua o caldo. Cocinar 25-30 minutos a fuego medio hasta que las lentejas estén tiernas. Ajustar sal.',
    prepTime: 40
  },
  {
    id: 14, name: 'Pasta con salsa de tomate y carne magra',
    type: ['almuerzo'],
    calories: 580, protein: 38, carbs: 72, fat: 12,
    ingredients: [
      { name: 'fideos integrales', amount: '100g' },
      { name: 'carne', amount: '150g picada magra' },
      { name: 'tomate', amount: '200ml triturado' },
      { name: 'cebolla', amount: '½ unidad' },
      { name: 'ajo', amount: '2 dientes' },
      { name: 'aceite de oliva', amount: '1 cda' },
      { name: 'albahaca', amount: 'a gusto' },
      { name: 'sal y pimienta', amount: 'a gusto' }
    ],
    instructions: 'Cocinar los fideos al dente. En paralelo, rehogar cebolla y ajo, agregar la carne y dorar bien. Incorporar el tomate triturado, sal, pimienta y cocinar 15 minutos a fuego bajo. Mezclar con la pasta y terminar con albahaca.',
    prepTime: 30
  },
  {
    id: 15, name: 'Arroz salteado con pollo y vegetales',
    type: ['almuerzo'],
    calories: 520, protein: 40, carbs: 60, fat: 10,
    ingredients: [
      { name: 'arroz integral', amount: '80g' },
      { name: 'pollo', amount: '180g pechuga' },
      { name: 'zanahoria', amount: '1 mediana' },
      { name: 'pimiento', amount: '½ unidad' },
      { name: 'cebolla', amount: '½ unidad' },
      { name: 'ajo', amount: '1 diente' },
      { name: 'salsa de soja', amount: '2 cdas' },
      { name: 'aceite', amount: '1 cda' }
    ],
    instructions: 'Cocinar el arroz. Cortar el pollo en cubos y dorar en sartén o wok a fuego alto. Retirar y en el mismo sartén saltear los vegetales 3-4 minutos. Volver el pollo, agregar el arroz cocido y salsa de soja. Saltear 2 minutos más.',
    prepTime: 30
  },
  {
    id: 16, name: 'Ensalada completa con pollo y huevo duro',
    type: ['almuerzo'],
    calories: 380, protein: 38, carbs: 18, fat: 18,
    ingredients: [
      { name: 'pollo', amount: '150g cocido' },
      { name: 'huevos', amount: '2 unidades' },
      { name: 'lechuga', amount: '3 hojas grandes' },
      { name: 'tomate', amount: '1 unidad' },
      { name: 'zanahoria', amount: '½ rallada' },
      { name: 'aceite de oliva', amount: '1 cda' },
      { name: 'vinagre', amount: 'al gusto' },
      { name: 'sal', amount: 'a gusto' }
    ],
    instructions: 'Hervir los huevos 10 minutos y enfriar. Mezclar lechuga, tomate y zanahoria. Agregar el pollo desmenuzado o en tiras y los huevos en cuartos. Aderezar con aceite, vinagre y sal al momento de servir.',
    prepTime: 15
  },
  {
    id: 17, name: 'Carne magra con papas al horno',
    type: ['almuerzo'],
    calories: 550, protein: 40, carbs: 50, fat: 14,
    ingredients: [
      { name: 'carne', amount: '200g bife de lomo' },
      { name: 'papa', amount: '2 medianas' },
      { name: 'ajo', amount: '2 dientes' },
      { name: 'romero', amount: '1 ramita' },
      { name: 'aceite de oliva', amount: '2 cdas' },
      { name: 'sal y pimienta', amount: 'a gusto' }
    ],
    instructions: 'Precalentar horno a 200°C. Cortar papas en gajos, mezclar con ajo aplastado, romero y aceite. Hornear 30-35 min dando vuelta a mitad. Cocinar la carne en sartén bien caliente 3-4 min por lado. Reposar 3 min antes de servir.',
    prepTime: 40
  },
  {
    id: 18, name: 'Fideos con pollo y brócoli',
    type: ['almuerzo'],
    calories: 510, protein: 38, carbs: 62, fat: 10,
    ingredients: [
      { name: 'fideos', amount: '100g penne' },
      { name: 'pollo', amount: '180g pechuga' },
      { name: 'brócoli', amount: '150g' },
      { name: 'ajo', amount: '2 dientes' },
      { name: 'aceite de oliva', amount: '1.5 cdas' },
      { name: 'sal y pimienta', amount: 'a gusto' }
    ],
    instructions: 'Cocinar pasta y brócoli (en el mismo agua los últimos 3 min). Dorar el pollo en cubos, agregar ajo laminado y saltear 1 min. Incorporar pasta y brócoli escurridos. Mezclar bien y servir con aceite de oliva.',
    prepTime: 25
  },
  {
    id: 19, name: 'Hamburguesa de carne con ensalada',
    type: ['almuerzo'],
    calories: 490, protein: 38, carbs: 30, fat: 22,
    ingredients: [
      { name: 'carne', amount: '200g picada magra' },
      { name: 'pan integral', amount: '1 unidad' },
      { name: 'lechuga', amount: '2 hojas' },
      { name: 'tomate', amount: '1 rodaja gruesa' },
      { name: 'cebolla', amount: '2 rodajas' },
      { name: 'mostaza', amount: '1 cdita' },
      { name: 'sal y ajo en polvo', amount: 'a gusto' }
    ],
    instructions: 'Condimentar la carne con sal y ajo en polvo, formar un medallón. Cocinar en sartén o plancha bien caliente 4-5 minutos por lado. Tostar el pan. Armar con lechuga, tomate, cebolla y mostaza.',
    prepTime: 15
  },
  {
    id: 20, name: 'Pollo al horno con batata',
    type: ['almuerzo'],
    calories: 480, protein: 42, carbs: 45, fat: 10,
    ingredients: [
      { name: 'pollo', amount: '250g muslos' },
      { name: 'batata', amount: '200g' },
      { name: 'ajo', amount: '3 dientes' },
      { name: 'pimentón dulce', amount: '1 cdita' },
      { name: 'aceite de oliva', amount: '1.5 cdas' },
      { name: 'sal, pimienta y orégano', amount: 'a gusto' }
    ],
    instructions: 'Precalentar horno a 200°C. Cortar batata en cubos, mezclar con aceite y pimentón. Condimentar el pollo con ajo, sal y pimienta. Colocar todo en la bandeja y hornear 35-40 min hasta que el pollo esté dorado y la batata tierna.',
    prepTime: 45
  },
  {
    id: 21, name: 'Cazuela de pollo con vegetales',
    type: ['almuerzo'],
    calories: 420, protein: 40, carbs: 30, fat: 12,
    ingredients: [
      { name: 'pollo', amount: '200g pechuga' },
      { name: 'zanahoria', amount: '1 unidad' },
      { name: 'cebolla', amount: '1 unidad' },
      { name: 'tomate', amount: '1 unidad' },
      { name: 'papa', amount: '1 mediana' },
      { name: 'ajo', amount: '2 dientes' },
      { name: 'caldo de verduras', amount: '300ml' },
      { name: 'aceite de oliva', amount: '1 cda' }
    ],
    instructions: 'Dorar el pollo en cubos grandes. Incorporar los vegetales cortados en trozos medianos y el ajo. Agregar el caldo y llevar a hervor. Bajar el fuego y cocinar tapado 25 minutos hasta que las papas estén tiernas.',
    prepTime: 35
  },
  {
    id: 22, name: 'Garbanzos salteados con pollo y espinaca',
    type: ['almuerzo'],
    calories: 460, protein: 38, carbs: 50, fat: 10,
    ingredients: [
      { name: 'garbanzos', amount: '200g cocidos' },
      { name: 'pollo', amount: '150g pechuga' },
      { name: 'espinaca', amount: '100g fresca' },
      { name: 'ajo', amount: '2 dientes' },
      { name: 'pimentón ahumado', amount: '1 cdita' },
      { name: 'aceite de oliva', amount: '1 cda' },
      { name: 'limón', amount: '½' },
      { name: 'sal', amount: 'a gusto' }
    ],
    instructions: 'Cortar el pollo en cubos y dorar en aceite. Agregar ajo y pimentón, saltear 1 min. Incorporar los garbanzos y cocinar 3 min. Agregar la espinaca y revolver hasta que marchite. Terminar con jugo de limón.',
    prepTime: 20
  },
  {
    id: 23, name: 'Milanesa de carne con puré de calabaza',
    type: ['almuerzo'],
    calories: 520, protein: 40, carbs: 45, fat: 16,
    ingredients: [
      { name: 'carne', amount: '200g bife de nalga fino' },
      { name: 'huevos', amount: '1 unidad' },
      { name: 'pan rallado', amount: '50g' },
      { name: 'calabaza', amount: '300g' },
      { name: 'leche', amount: '2 cdas' },
      { name: 'manteca', amount: '1 cdita' },
      { name: 'sal, pimienta y ajo en polvo', amount: 'a gusto' }
    ],
    instructions: 'Cocinar calabaza al vapor o microondas. Pisarla con leche, manteca y sal. Pasar los bifes por huevo batido y pan rallado sazonado. Cocinar al horno 200°C 20 min. Servir con el puré.',
    prepTime: 35
  },
  {
    id: 24, name: 'Revuelto gramajo',
    type: ['almuerzo'],
    calories: 420, protein: 28, carbs: 35, fat: 18,
    ingredients: [
      { name: 'huevos', amount: '3 unidades' },
      { name: 'jamón', amount: '80g cocido' },
      { name: 'papa', amount: '2 medianas cocidas' },
      { name: 'cebolla', amount: '½ unidad' },
      { name: 'aceite', amount: '2 cdas' },
      { name: 'sal y pimienta', amount: 'a gusto' },
      { name: 'perejil', amount: 'a gusto' }
    ],
    instructions: 'Freír las papas cortadas en bastones finos hasta dorar. Retirar y saltear la cebolla en el mismo aceite. Agregar el jamón en tiras y las papas. Incorporar los huevos batidos con sal y revolver constantemente a fuego medio-bajo. Terminar con perejil.',
    prepTime: 25
  },
  {
    id: 25, name: 'Pollo con curry y arroz',
    type: ['almuerzo'],
    calories: 490, protein: 40, carbs: 55, fat: 10,
    ingredients: [
      { name: 'pollo', amount: '200g pechuga' },
      { name: 'arroz', amount: '80g basmati o blanco' },
      { name: 'cebolla', amount: '½ unidad' },
      { name: 'curry en polvo', amount: '2 cditas' },
      { name: 'leche de coco light', amount: '100ml' },
      { name: 'ajo', amount: '1 diente' },
      { name: 'aceite de oliva', amount: '1 cda' },
      { name: 'sal', amount: 'a gusto' }
    ],
    instructions: 'Cocinar el arroz. Cortar el pollo en cubos, dorar en aceite. Rehogar cebolla y ajo, agregar curry 1 min. Incorporar el pollo y la leche de coco, cocinar 10 min a fuego medio. Servir sobre el arroz.',
    prepTime: 30
  },
  {
    id: 26, name: 'Wrap de pollo con vegetales',
    type: ['almuerzo'],
    calories: 450, protein: 35, carbs: 45, fat: 10,
    ingredients: [
      { name: 'tortilla integral', amount: '1 unidad grande' },
      { name: 'pollo', amount: '150g pechuga' },
      { name: 'pimiento', amount: '½ asado' },
      { name: 'lechuga', amount: '2 hojas' },
      { name: 'tomate', amount: '½' },
      { name: 'queso untable', amount: '1 cda' },
      { name: 'limón y sal', amount: 'a gusto' }
    ],
    instructions: 'Cocinar el pollo a la plancha y cortarlo en tiras. Untar la tortilla con queso untable. Colocar lechuga, tomate, pimiento y el pollo. Exprimir limón, enrollar bien ajustado y cortar al medio.',
    prepTime: 15
  },

  // ── CENA ─────────────────────────────────────────────────────────────────

  {
    id: 27, name: 'Sopa de verduras con pollo',
    type: ['cena'],
    calories: 320, protein: 28, carbs: 25, fat: 8,
    ingredients: [
      { name: 'pollo', amount: '150g pechuga' },
      { name: 'zanahoria', amount: '1 unidad' },
      { name: 'cebolla', amount: '½ unidad' },
      { name: 'calabaza', amount: '150g' },
      { name: 'tomate', amount: '1 unidad' },
      { name: 'ajo', amount: '2 dientes' },
      { name: 'caldo de pollo', amount: '500ml' },
      { name: 'sal y perejil', amount: 'a gusto' }
    ],
    instructions: 'Dorar el pollo en cubos. Agregar todos los vegetales cortados en trozos medianos y el caldo. Llevar a hervor y cocinar 20-25 minutos. Ajustar sal. Servir con perejil fresco.',
    prepTime: 30
  },
  {
    id: 28, name: 'Ensalada de estación con huevo duro',
    type: ['cena'],
    calories: 280, protein: 18, carbs: 15, fat: 16,
    ingredients: [
      { name: 'lechuga', amount: '3 hojas grandes' },
      { name: 'tomate', amount: '1 unidad' },
      { name: 'huevos', amount: '2 unidades' },
      { name: 'zanahoria', amount: '½ rallada' },
      { name: 'maíz', amount: '2 cdas' },
      { name: 'aceite de oliva', amount: '1 cda' },
      { name: 'vinagre de manzana', amount: '1 cdita' },
      { name: 'sal', amount: 'a gusto' }
    ],
    instructions: 'Hervir los huevos 10 minutos. Preparar la ensalada mezclando todos los vegetales. Cortar los huevos en cuartos. Aderezar con aceite, vinagre y sal justo antes de servir.',
    prepTime: 15
  },
  {
    id: 29, name: 'Tortilla española de vegetales',
    type: ['cena'],
    calories: 320, protein: 20, carbs: 22, fat: 18,
    ingredients: [
      { name: 'huevos', amount: '4 unidades' },
      { name: 'papa', amount: '2 medianas' },
      { name: 'cebolla', amount: '½ unidad' },
      { name: 'pimiento', amount: '½ unidad' },
      { name: 'aceite de oliva', amount: '2 cdas' },
      { name: 'sal y pimienta', amount: 'a gusto' }
    ],
    instructions: 'Cocinar papas y cebolla en aceite a fuego bajo hasta tiernas (15 min). Escurrir exceso de aceite. Mezclar con huevos batidos y pimiento. Cocinar en sartén tapada a fuego muy bajo 10 min. Dar vuelta con un plato y cocinar 5 min más.',
    prepTime: 30
  },
  {
    id: 30, name: 'Pollo grillado con ensalada verde',
    type: ['cena'],
    calories: 380, protein: 40, carbs: 10, fat: 12,
    ingredients: [
      { name: 'pollo', amount: '180g pechuga' },
      { name: 'lechuga', amount: '3 hojas' },
      { name: 'pepino', amount: '½' },
      { name: 'palta', amount: '¼' },
      { name: 'aceite de oliva', amount: '1 cda' },
      { name: 'limón', amount: '½' },
      { name: 'sal y pimienta', amount: 'a gusto' }
    ],
    instructions: 'Condimentar el pollo con sal, pimienta y limón. Grillarlo 5-6 min por lado. Preparar la ensalada mezclando lechuga, pepino y palta. Aderezar con aceite y limón. Servir el pollo sobre la cama de ensalada.',
    prepTime: 15
  },
  {
    id: 31, name: 'Carne magra con vegetales al vapor',
    type: ['cena'],
    calories: 420, protein: 40, carbs: 20, fat: 14,
    ingredients: [
      { name: 'carne', amount: '180g bife de cuadril' },
      { name: 'brócoli', amount: '150g' },
      { name: 'zanahoria', amount: '1 unidad' },
      { name: 'cebolla', amount: '½' },
      { name: 'aceite de oliva', amount: '1 cdita' },
      { name: 'sal, pimienta y limón', amount: 'a gusto' }
    ],
    instructions: 'Cocinar brócoli y zanahoria al vapor 8-10 minutos hasta tiernos pero firmes. Cocinar la carne en sartén bien caliente 3-4 min por lado. Reposar 2 minutos. Servir con los vegetales al vapor y un hilo de aceite.',
    prepTime: 20
  },
  {
    id: 32, name: 'Crema de calabaza',
    type: ['cena'],
    calories: 220, protein: 8, carbs: 35, fat: 6,
    ingredients: [
      { name: 'calabaza', amount: '400g' },
      { name: 'cebolla', amount: '½ unidad' },
      { name: 'ajo', amount: '1 diente' },
      { name: 'caldo de verduras', amount: '300ml' },
      { name: 'aceite de oliva', amount: '1 cda' },
      { name: 'nuez moscada', amount: 'pizca' },
      { name: 'sal y pimienta', amount: 'a gusto' }
    ],
    instructions: 'Rehogar cebolla y ajo en aceite. Agregar la calabaza en cubos y el caldo. Cocinar 20 minutos hasta que la calabaza esté muy tierna. Procesar con mixer hasta crema lisa. Condimentar con sal, pimienta y nuez moscada.',
    prepTime: 30
  },
  {
    id: 33, name: 'Wok de pollo con brócoli y arroz integral',
    type: ['cena'],
    calories: 480, protein: 42, carbs: 55, fat: 8,
    ingredients: [
      { name: 'pollo', amount: '180g pechuga' },
      { name: 'brócoli', amount: '150g' },
      { name: 'arroz integral', amount: '150g cocido' },
      { name: 'ajo', amount: '2 dientes' },
      { name: 'jengibre', amount: '½ cdita rallado' },
      { name: 'salsa de soja', amount: '2 cdas' },
      { name: 'aceite', amount: '1 cda' }
    ],
    instructions: 'Calentar el wok o sartén grande a fuego muy alto. Saltear el pollo en cubos hasta dorar. Agregar brócoli en floretes, ajo y jengibre. Saltear 3-4 min. Incorporar el arroz y salsa de soja. Mezclar bien y servir inmediatamente.',
    prepTime: 20
  },
  {
    id: 34, name: 'Ensalada de pollo con palta',
    type: ['cena'],
    calories: 340, protein: 38, carbs: 8, fat: 18,
    ingredients: [
      { name: 'pollo', amount: '150g cocido' },
      { name: 'palta', amount: '½ unidad' },
      { name: 'lechuga', amount: '3 hojas' },
      { name: 'tomate cherry', amount: '8 unidades' },
      { name: 'limón', amount: '1' },
      { name: 'aceite de oliva', amount: '1 cda' },
      { name: 'sal y pimienta', amount: 'a gusto' }
    ],
    instructions: 'Desmenuzar el pollo cocido. Cortar la palta en cubos y rociar con limón para que no se oxide. Mezclar todos los ingredientes. Aderezar con aceite, limón restante y sal. Servir fresco.',
    prepTime: 10
  },
  {
    id: 35, name: 'Tarta de verduras sin masa',
    type: ['cena'],
    calories: 360, protein: 18, carbs: 28, fat: 18,
    ingredients: [
      { name: 'huevos', amount: '4 unidades' },
      { name: 'queso', amount: '100g cremoso' },
      { name: 'espinaca', amount: '200g' },
      { name: 'cebolla', amount: '½ unidad' },
      { name: 'calabaza', amount: '150g cocida' },
      { name: 'sal, pimienta y nuez moscada', amount: 'a gusto' }
    ],
    instructions: 'Rehogar cebolla hasta transparentar. Agregar espinaca hasta que marchite. Mezclar en bowl con huevos batidos, queso, calabaza pisada y condimentos. Volcar en molde enmantecado. Hornear a 180°C 30-35 min hasta que esté firme y dorada.',
    prepTime: 45
  },
  {
    id: 36, name: 'Pollo al limón con vegetales al horno',
    type: ['cena'],
    calories: 400, protein: 42, carbs: 18, fat: 14,
    ingredients: [
      { name: 'pollo', amount: '200g pechuga' },
      { name: 'limón', amount: '1 unidad' },
      { name: 'ajo', amount: '3 dientes' },
      { name: 'zanahoria', amount: '1 unidad' },
      { name: 'brócoli', amount: '150g' },
      { name: 'aceite de oliva', amount: '1.5 cdas' },
      { name: 'romero y tomillo', amount: 'a gusto' },
      { name: 'sal y pimienta', amount: 'a gusto' }
    ],
    instructions: 'Marinar el pollo con limón, ajo, hierbas, sal y pimienta 15 minutos. Colocar en bandeja con los vegetales troceados y aceite. Hornear a 200°C 30-35 minutos hasta que el pollo esté bien cocido y las verduras doradas.',
    prepTime: 45
  },

  // ── MERIENDA / SNACK ─────────────────────────────────────────────────────

  {
    id: 37, name: 'Manzana con mantequilla de maní',
    type: ['merienda', 'snack'],
    calories: 250, protein: 7, carbs: 30, fat: 12,
    ingredients: [
      { name: 'manzana', amount: '1 mediana' },
      { name: 'mantequilla de maní', amount: '2 cdas (30g)' }
    ],
    instructions: 'Cortar la manzana en gajos. Servir con la mantequilla de maní al costado para untar. Elegir maní 100% natural sin azúcar agregada.',
    prepTime: 3
  },
  {
    id: 38, name: 'Yogurt natural con nueces',
    type: ['merienda', 'snack'],
    calories: 220, protein: 12, carbs: 18, fat: 10,
    ingredients: [
      { name: 'yogurt natural', amount: '200g' },
      { name: 'nueces', amount: '20g' },
      { name: 'miel', amount: '1 cdita (opcional)' }
    ],
    instructions: 'Servir el yogurt en un bowl. Agregar las nueces partidas. Opcionalmente un hilo de miel. No usar yogures con fruta artificial — mejor el natural.',
    prepTime: 2
  },
  {
    id: 39, name: 'Mix de nueces y almendras',
    type: ['merienda', 'snack'],
    calories: 180, protein: 5, carbs: 6, fat: 16,
    ingredients: [
      { name: 'nueces', amount: '15g' },
      { name: 'almendras', amount: '15g' },
      { name: 'maní sin sal', amount: '10g (opcional)' }
    ],
    instructions: 'Mezclar los frutos secos. Consumir como snack entre comidas. Evitar las versiones tostadas con aceite o azúcar.',
    prepTime: 1
  },
  {
    id: 40, name: 'Tostadas con queso untable descremado',
    type: ['merienda', 'snack'],
    calories: 180, protein: 10, carbs: 22, fat: 5,
    ingredients: [
      { name: 'pan integral', amount: '2 rebanadas' },
      { name: 'queso untable', amount: '50g descremado' },
      { name: 'tomate', amount: '2 rodajas (opcional)' }
    ],
    instructions: 'Tostar el pan. Untar generosamente con queso untable. Opcionalmente agregar rodajas de tomate y una pizca de orégano.',
    prepTime: 5
  },
  {
    id: 41, name: 'Batido proteico casero',
    type: ['merienda', 'snack'],
    calories: 280, protein: 20, carbs: 38, fat: 6,
    ingredients: [
      { name: 'leche', amount: '250ml descremada' },
      { name: 'banana', amount: '½' },
      { name: 'cacao en polvo', amount: '1 cda amargo' },
      { name: 'avena', amount: '3 cdas' },
      { name: 'miel', amount: '1 cdita' }
    ],
    instructions: 'Licuar todos los ingredientes hasta obtener una bebida homogénea. Consumir dentro de los 30 minutos post-entreno para optimizar la recuperación muscular.',
    prepTime: 5
  },
  {
    id: 42, name: 'Barritas de avena caseras',
    type: ['merienda', 'snack'],
    calories: 200, protein: 6, carbs: 32, fat: 6,
    ingredients: [
      { name: 'avena', amount: '100g' },
      { name: 'miel', amount: '3 cdas' },
      { name: 'banana', amount: '1 madura' },
      { name: 'nueces', amount: '20g picadas' },
      { name: 'chips de chocolate amargo', amount: '10g (opcional)' }
    ],
    instructions: 'Pisar la banana. Mezclar con avena, miel y nueces hasta obtener masa compacta. Distribuir en molde cuadrado forrado con papel. Prensar bien. Hornear 180°C 20-25 min. Enfriar completamente antes de cortar en barritas.',
    prepTime: 30
  },
  {
    id: 43, name: 'Fruta fresca de estación',
    type: ['merienda', 'snack'],
    calories: 80, protein: 1, carbs: 18, fat: 0,
    ingredients: [
      { name: 'naranja', amount: '1 unidad' },
      { name: 'manzana', amount: '1 unidad' }
    ],
    instructions: 'Consumir la fruta entera preferiblemente (más fibra que el jugo). Buena opción de snack entre comidas por su aporte de vitaminas y saciedad con pocas calorías.',
    prepTime: 2
  },
  {
    id: 44, name: 'Gelatina con fruta',
    type: ['merienda', 'snack'],
    calories: 80, protein: 3, carbs: 15, fat: 0,
    ingredients: [
      { name: 'gelatina sin azúcar', amount: '1 sobre' },
      { name: 'agua caliente', amount: '250ml' },
      { name: 'agua fría', amount: '250ml' },
      { name: 'fruta fresca', amount: '100g (frutillas, kiwi o durazno)' }
    ],
    instructions: 'Disolver la gelatina en agua caliente. Agregar agua fría y mezclar. Incorporar la fruta cortada en trozos. Refrigerar mínimo 2 horas hasta solidificar. Ideal para la noche si querés algo dulce y liviano.',
    prepTime: 5
  },
  {
    id: 45, name: 'Empanadas de carne',
    type: ['almuerzo', 'cena'],
    calories: 480, protein: 28, carbs: 45, fat: 18,
    ingredients: [
      { name: 'tapas de empanada', amount: '1 paquete (12 tapas)' },
      { name: 'carne picada', amount: '400g' },
      { name: 'cebolla', amount: '1 grande' },
      { name: 'huevos', amount: '2 duros' },
      { name: 'ajo', amount: '2 dientes' },
      { name: 'pimentón', amount: '1 cdita' },
      { name: 'comino', amount: '½ cdita' },
      { name: 'aceite de oliva', amount: '1 cda' },
      { name: 'sal y pimienta', amount: 'a gusto' }
    ],
    instructions: 'Rehogar cebolla y ajo en aceite hasta transparentar. Agregar la carne picada y dorar bien. Condimentar con pimentón, comino, sal y pimienta. Enfriar el relleno. Agregar huevo duro picado. Rellenar las tapas, repulgar y hornear a 200°C 20-25 min hasta dorar.',
    prepTime: 45
  },
  {
    id: 46, name: 'Costeletas con papas al horno',
    type: ['almuerzo', 'cena'],
    calories: 510, protein: 38, carbs: 42, fat: 18,
    ingredients: [
      { name: 'costeletas', amount: '2 unidades' },
      { name: 'papa', amount: '2 medianas' },
      { name: 'ajo', amount: '2 dientes' },
      { name: 'aceite de oliva', amount: '1.5 cdas' },
      { name: 'orégano', amount: 'a gusto' },
      { name: 'sal y pimienta', amount: 'a gusto' }
    ],
    instructions: 'Precalentar horno a 200°C. Cortar las papas en gajos, mezclar con aceite, ajo aplastado y sal. Hornear 15 min. Condimentar las costeletas con sal, pimienta y orégano. Agregar a la bandeja y hornear 20-25 min más dando vuelta a mitad hasta que estén doradas.',
    prepTime: 40
  },
  {
    id: 47, name: 'Tostadas con fiambre y queso',
    type: ['desayuno', 'merienda'],
    calories: 320, protein: 18, carbs: 28, fat: 14,
    ingredients: [
      { name: 'pan integral', amount: '2 rebanadas' },
      { name: 'salame o mortadela', amount: '60g' },
      { name: 'queso en fetas', amount: '2 fetas (40g)' },
      { name: 'manteca', amount: '1 cdita (opcional)' }
    ],
    instructions: 'Tostar el pan. Colocar el queso sobre el pan caliente para que se derrita levemente. Agregar el fiambre encima. Opcionalmente untar con un poco de manteca antes del queso. Rápido y con buena proteína para el desayuno.',
    prepTime: 5
  }
];

// ─── DEFAULT PANTRY ─────────────────────────────────────────────────────────

const DEFAULT_PANTRY_ITEMS = [
  { name: 'Arroz integral',    detail: '',                  quantity: 500, unit: 'g' },
  { name: 'Fideos integrales', detail: 'penne o spaghetti', quantity: 500, unit: 'g' },
  { name: 'Pollo',             detail: 'pechuga',           quantity: 1,   unit: 'kg' },
  { name: 'Huevos',            detail: '',                  quantity: 12,  unit: 'unidades' },
  { name: 'Leche',             detail: 'descremada',        quantity: 1,   unit: 'L' },
  { name: 'Yogurt',            detail: 'natural',           quantity: 400, unit: 'g' },
  { name: 'Avena',             detail: '',                  quantity: 500, unit: 'g' },
  { name: 'Pan integral',      detail: '',                  quantity: 1,   unit: 'paquetes' },
  { name: 'Tomate',            detail: '',                  quantity: 4,   unit: 'unidades' },
  { name: 'Lechuga',           detail: '',                  quantity: 1,   unit: 'unidades' },
  { name: 'Zanahoria',         detail: '',                  quantity: 3,   unit: 'unidades' },
  { name: 'Cebolla',           detail: '',                  quantity: 3,   unit: 'unidades' },
  { name: 'Ajo',               detail: '',                  quantity: 1,   unit: 'paquetes' },
  { name: 'Aceite de oliva',   detail: '',                  quantity: 500, unit: 'ml' },
  { name: 'Sal',               detail: '',                  quantity: 1,   unit: 'paquetes' },
  { name: 'Pimiento',          detail: 'rojo',              quantity: 2,   unit: 'unidades' },
  { name: 'Calabaza',          detail: '',                  quantity: 500, unit: 'g' },
  { name: 'Batata',            detail: '',                  quantity: 500, unit: 'g' },
  { name: 'Lentejas',          detail: '',                  quantity: 400, unit: 'g' },
  { name: 'Garbanzos',         detail: 'cocidos o en lata', quantity: 400, unit: 'g' },
  { name: 'Queso untable',     detail: 'descremado',        quantity: 200, unit: 'g' },
  { name: 'Ricota',            detail: 'descremada',        quantity: 250, unit: 'g' },
  { name: 'Banana',            detail: '',                  quantity: 4,   unit: 'unidades' },
  { name: 'Manzana',           detail: '',                  quantity: 3,   unit: 'unidades' },
  { name: 'Naranja',           detail: '',                  quantity: 3,   unit: 'unidades' }
];

// ─── WORKOUT SEQUENCE ────────────────────────────────────────────────────────

/**
 * Formats a Date using the user's local calendar day instead of UTC.
 * This prevents late-night workouts from being assigned to the next day.
 * @param {Date} date
 * @returns {string} Local ISO date string (YYYY-MM-DD)
 */
function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses an ISO calendar date without applying a UTC offset.
 * @param {string} dateStr
 * @returns {Date}
 */
function parseLocalDateString(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Determines the workout day type based on a 7-day rotation.
 * Cycle: A=0, B=1, A=2, rest=3, B=4, A=5, rest=6
 * @param {string} dateStr - ISO date string (YYYY-MM-DD) of the target day
 * @param {string} startDateStr - ISO date string of the program start date
 * @returns {'A'|'B'|'rest'}
 */
function getWorkoutDayType(dateStr, startDateStr) {
  if (!startDateStr) return 'A';
  const start = parseLocalDateString(startDateStr);
  start.setHours(0, 0, 0, 0);
  const date = parseLocalDateString(dateStr);
  date.setHours(0, 0, 0, 0);
  const diff = Math.floor((date - start) / 86400000);
  const CYCLE = ['A', 'B', 'A', 'rest', 'B', 'A', 'rest'];
  return CYCLE[((diff % 7) + 7) % 7];
}

/**
 * Generates the Day A (Fuerza) workout sequence.
 * @param {number} rounds - Number of circuit rounds (2 or 3)
 * @returns {Array} Ordered array of exercise steps
 */
function getDayASequence(rounds = 2) {
  const steps = [];
  let id = 0;

  const add = (step) => steps.push({ id: id++, ...step });

  // ── CALENTAMIENTO (10 min) ────────────────────────────────────────────────
  add({ name: 'Saltando cuerda', section: 'Calentamiento', type: 'timed', duration: 120,
        description: '2 minutos a ritmo moderado para activar el cuerpo' });
  add({ name: 'Jumping jacks', section: 'Calentamiento', type: 'timed', duration: 60,
        description: 'Saltá abriendo brazos y piernas al mismo tiempo' });
  add({ name: 'Skipping en el lugar', section: 'Calentamiento', type: 'timed', duration: 60,
        description: 'Rodillas al pecho, ritmo progresivo' });
  add({ name: 'Movilidad articular', section: 'Calentamiento', type: 'timed', duration: 180,
        description: 'Giros de cintura, cadera, hombros y tobillos — lento y controlado',
        tip: 'Llegá al límite del rango, sin dolor' });
  add({ name: 'Shadow boxing suave', section: 'Calentamiento', type: 'timed', duration: 120,
        description: 'Golpes suaves moviéndote liviano, activá los hombros y caderas' });
  add({ name: 'Estiramientos dinámicos', section: 'Calentamiento', type: 'timed', duration: 60,
        description: 'Estocadas dinámicas, rotaciones de tronco, balanceos de pierna',
        tip: 'Movimientos fluidos, no estáticos' });

  // ── CIRCUITO 1: FUERZA TREN INFERIOR (piernas + glúteos) ─────────────────
  // Fuerza primero, cardio al final — máximo estímulo muscular con energía fresca
  const circuit1Exercises = [
    { name: 'Sentadilla lenta', type: 'reps', reps: 10,
      description: '3 segundos bajando, 1 segundo arriba — enfocate en la tensión',
      tip: 'Rodillas alineadas con los pies, pecho erguido, profundidad máxima' },
    { name: 'Puente de glúteos', type: 'reps', reps: 15,
      description: 'Acostado boca arriba, rodillas flexionadas. Elevá la cadera y apretá los glúteos 2 seg arriba',
      tip: 'No arquees la espalda baja — el movimiento es de cadera, no de columna' },
    { name: 'Zancada reversa con pausa', type: 'reps', reps: 8, repsPerSide: true,
      description: '8 reps por pierna: llevá el pie hacia atrás, pausá 1 seg abajo, volvé',
      tip: 'Torso recto, rodilla trasera casi toca el piso' },
    { name: 'Sentadilla sumo', type: 'reps', reps: 12,
      description: 'Pies más separados que los hombros, puntas hacia afuera — trabaja la cara interna del muslo y glúteos',
      tip: 'Bajá hasta que los muslos queden paralelos al piso' }
  ];

  for (let r = 1; r <= rounds; r++) {
    const roundLabel = `Circuito 1: Piernas y Glúteos — Ronda ${r}/${rounds}`;
    circuit1Exercises.forEach(ex => {
      add({ ...ex, section: roundLabel, round: r, totalRounds: rounds });
    });
    if (r < rounds) {
      add({ name: 'Descanso', section: roundLabel, type: 'rest', duration: 90,
            description: 'Recuperate bien — estos 90 seg son necesarios para la fuerza' });
    }
  }

  // ── CIRCUITO 2: FUERZA TREN SUPERIOR (push + pull + bíceps) ──────────────
  // Ahora sí hay movimientos de tirón para balancear el trabajo muscular
  const circuit2Exercises = [
    { name: 'Flexión de brazos lenta', type: 'reps', reps: 10,
      description: '3 segundos bajando, 1 segundo arriba — sin tocar el piso',
      tip: 'Cuerpo recto como tabla, codos a 45° del cuerpo, no abiertos' },
    { name: 'Remo invertido con mesa', type: 'reps', reps: 12,
      description: 'Acostado bajo una mesa resistente, agarrá el borde, tirá el pecho hacia arriba controlando la bajada',
      tip: 'Es el único ejercicio de tirón de la rutina — crucial para la espalda y bíceps. Buscá una mesa que aguante tu peso' },
    { name: 'Fondos en banco/silla', type: 'reps', reps: 12,
      description: 'Bajá hasta 90° de flexión de codo, empujá hacia arriba completo',
      tip: 'Codos apuntan hacia atrás, no hacia los costados' },
    { name: 'Curl de bíceps', type: 'reps', reps: 12,
      description: 'Con mancuernas o botellas de agua llenas — subí lento (2 seg) y bajá más lento (3 seg)',
      tip: 'Codos pegados al cuerpo, no balancees el torso' }
  ];

  for (let r = 1; r <= rounds; r++) {
    const roundLabel = `Circuito 2: Tren Superior — Ronda ${r}/${rounds}`;
    circuit2Exercises.forEach(ex => {
      add({ ...ex, section: roundLabel, round: r, totalRounds: rounds });
    });
    if (r < rounds) {
      add({ name: 'Descanso', section: roundLabel, type: 'rest', duration: 90,
            description: 'Recuperate — el músculo crece en el descanso, no en el esfuerzo' });
    }
  }

  // ── CIRCUITO 3: CORE + BOXEO (condicionamiento) ───────────────────────────
  const circuit3Exercises = [
    { name: 'Bolsa de boxeo', type: 'timed', duration: 120,
      description: 'Combinaciones variadas: jab-cross, ganchos, uppercut + desplazamientos laterales',
      tip: 'Mantené la guardia entre golpes, respirá al golpear' },
    { name: 'Plancha', type: 'timed', duration: 45,
      description: 'Cuerpo recto, core apretado, respiración constante',
      tip: 'Espalda plana — si caen las caderas, bajá las rodillas al piso' },
    { name: 'Abdominales bicicleta', type: 'reps', reps: 20,
      description: 'Codo hacia rodilla opuesta, rotación real del tronco — lento y controlado',
      tip: 'Velocidad moderada, si lo hacés rápido es inercia, no abdomen' },
    { name: 'Russian twists', type: 'reps', reps: 20,
      description: 'Sentado con torso a 45°, con botella llena. Rotá tocando el piso a cada lado',
      tip: 'Mantené las piernas levantadas para más dificultad' },
    { name: 'Mountain climbers', type: 'timed', duration: 45,
      description: 'Rodillas al pecho en alternancia rápida — es cardio de core',
      tip: 'Hombros sobre las muñecas, caderas sin subir' }
  ];

  for (let r = 1; r <= rounds; r++) {
    const roundLabel = `Circuito 3: Core y Boxeo — Ronda ${r}/${rounds}`;
    circuit3Exercises.forEach(ex => {
      add({ ...ex, section: roundLabel, round: r, totalRounds: rounds });
    });
    if (r < rounds) {
      add({ name: 'Descanso', section: roundLabel, type: 'rest', duration: 60,
            description: 'Recuperate, preparate para la próxima ronda' });
    }
  }

  // ── CARDIO FINAL (8-10 min) ───────────────────────────────────────────────
  // Al final, cuando la fuerza ya está hecha — maximiza la quema de grasa
  add({ name: 'Bicicleta fija — intervalos', section: 'Cardio Final', type: 'timed', duration: 240,
        description: '4 min de intervalos: 40 seg al máximo / 20 seg suave — repetir 4 veces',
        tip: 'El 40 seg tiene que ser tan fuerte que no puedas mantenerlo más' });
  add({ name: 'Salto de cuerda — RÁPIDO', section: 'Cardio Final', type: 'timed', duration: 90,
        description: '90 seg al máximo ritmo sostenible — salto doble si podés' });
  add({ name: 'Burpees', section: 'Cardio Final', type: 'timed', duration: 30,
        description: '30 segundos sin parar — cada repetición completa cuenta',
        tip: 'Saltá con los brazos arriba en la parte alta, pecho al piso en la baja' });
  add({ name: 'Descanso activo', section: 'Cardio Final', type: 'rest', duration: 20,
        description: 'Caminá o movete suave' });
  add({ name: 'Burpees', section: 'Cardio Final', type: 'timed', duration: 30,
        description: 'Segunda serie — dale todo lo que te queda' });

  // ── ENFRIAMIENTO (7 min) ──────────────────────────────────────────────────
  add({ name: 'Estiramiento de cuádriceps y flexores de cadera', section: 'Enfriamiento', type: 'timed', duration: 60,
        description: 'De pie, llevá el talón al glúteo 30 seg por lado. Luego rodilla en tierra, empujá la cadera hacia adelante',
        tip: 'Mantené la posición sin rebotar' });
  add({ name: 'Estiramiento de isquiotibiales', section: 'Enfriamiento', type: 'timed', duration: 60,
        description: 'Sentado en el piso, piernas extendidas. Inclinás el tronco hacia adelante manteniendo la espalda recta',
        tip: 'No importa cuánto llegás, importa mantener la espalda larga' });
  add({ name: 'Estiramiento de hombros y pecho', section: 'Enfriamiento', type: 'timed', duration: 60,
        description: 'Cruzá un brazo al pecho y sostené 30 seg. Luego entrelazá manos atrás y abrí el pecho',
        tip: 'Respirá profundo en cada posición' });
  add({ name: 'Estiramiento de espalda', section: 'Enfriamiento', type: 'timed', duration: 60,
        description: 'En cuatro patas: posición del niño 30 seg, luego gato-vaca 30 seg (arquear y redondear la espalda)' });
  add({ name: 'Respiración profunda', section: 'Enfriamiento', type: 'timed', duration: 120,
        description: 'Acostado boca arriba. Inhalá 4 seg por la nariz, aguantá 4 seg, exhalá 6 seg por la boca',
        tip: 'La exhalación larga activa el sistema nervioso parasimpático — bajás las pulsaciones más rápido' });

  return steps;
}

/** Backward-compat alias for getDayASequence. */
function getWorkoutSequence(rounds = 2) {
  return getDayASequence(rounds);
}

/**
 * Generates the Day B (Cardio y Boxeo) workout sequence.
 * @param {number} rounds - Progressive cardio/core rounds (1 to 3).
 * @returns {Array} Ordered array of exercise steps
 */
function getDayBSequence(rounds = 2) {
  const steps = [];
  let id = 0;
  const add = (step) => steps.push({ id: id++, ...step });
  const safeRounds = Math.min(3, Math.max(1, parseInt(rounds, 10) || 2));

  // ── CALENTAMIENTO (8 min) ─────────────────────────────────────────────────
  add({ name: 'Saltando cuerda', section: 'Calentamiento', type: 'timed', duration: 120,
        description: '2 minutos a ritmo moderado para activar el cuerpo' });
  add({ name: 'Jumping jacks', section: 'Calentamiento', type: 'timed', duration: 60,
        description: 'Saltá abriendo brazos y piernas al mismo tiempo' });
  add({ name: 'Skipping en el lugar', section: 'Calentamiento', type: 'timed', duration: 60,
        description: 'Rodillas al pecho, ritmo progresivo' });
  add({ name: 'Shadow boxing suave', section: 'Calentamiento', type: 'timed', duration: 120,
        description: 'Golpes suaves moviéndote liviano, activá los hombros y caderas',
        tip: 'Moviéndote liviano, calentá hombros y caderas' });
  add({ name: 'Movilidad articular', section: 'Calentamiento', type: 'timed', duration: 120,
        description: 'Giros de cintura, cadera, hombros y tobillos — lento y controlado',
        tip: 'Giros de cintura, cadera, hombros' });

  // ── BLOQUE 1: ROUNDS DE BOXEO (15 min) ───────────────────────────────────
  // 4 rounds: 2 min golpes + 1 min descanso, each with a different focus
  const boxingRounds = [
    { focus: 'Volumen',       tip: 'Jabs y crosses en serie — ritmo alto, 3-4 golpes por segundo. Moviéndote todo el tiempo' },
    { focus: 'Potencia',      tip: 'Ganchos y uppercuts — menos cantidad, más potencia en cada golpe. Respirá al impactar' },
    { focus: 'Combinaciones', tip: 'Combinaciones mixtas: jab-cross-gancho, jab-cross-uppercut. Desplazamientos laterales entre combos' },
    { focus: 'Todo',          tip: '¡Último round! Combinaciones libres al máximo. Todo lo que te queda' }
  ];

  boxingRounds.forEach(({ focus, tip }, i) => {
    const roundNum = i + 1;
    const sectionLabel = `Bloque 1: Boxeo — Round ${roundNum}/4`;
    add({ name: `Bolsa — Round ${roundNum}: ${focus}`, section: sectionLabel,
          type: 'timed', duration: 120, description: tip });
    add({ name: 'Descanso', section: sectionLabel, type: 'rest', duration: 60,
          description: 'Recuperate — caminá, respirá profundo' });
  });

  // ── BLOQUE 2: CARDIO INTERVALS (progressive volume) ──────────────────────
  const bikeIntervals = safeRounds + 1;
  add({ name: 'Bicicleta fija — intervalos', section: 'Bloque 2: Cardio', type: 'timed', duration: bikeIntervals * 60,
        description: `40 seg fuerte / 20 seg suave — ${bikeIntervals} repeticiones`,
        tip: 'El 40s tiene que ser tan difícil que no lo puedas mantener más' });
  add({ name: 'Salto de cuerda sostenido', section: 'Bloque 2: Cardio', type: 'timed', duration: 120,
        description: 'Ritmo sostenible pero exigente — no pares' });
  for (let r = 1; r <= safeRounds; r++) {
    add({ name: `Burpees serie ${r}`, section: 'Bloque 2: Cardio', type: 'timed', duration: 30,
          description: r === safeRounds ? 'Última serie — mantené la técnica' : '30 seg con técnica controlada',
          round: r, totalRounds: safeRounds });
    if (r < safeRounds) {
      add({ name: 'Descanso activo', section: 'Bloque 2: Cardio', type: 'rest', duration: 20,
            description: 'Caminá y recuperá el aire antes de la próxima serie' });
    }
  }
  add({ name: 'Saltos laterales', section: 'Bloque 2: Cardio', type: 'timed', duration: 60,
        description: 'Saltá de lado a lado con ritmo constante' });
  add({ name: 'Salto de cuerda FINAL', section: 'Bloque 2: Cardio', type: 'timed', duration: 90,
        description: 'Cierre de cardio — ritmo fuerte que puedas sostener con buena técnica' });

  // ── BLOQUE 3: CORE (1 to 3 controlled rounds) ─────────────────────────────
  const coreExercises = [
    { name: 'Mountain climbers', type: 'timed', duration: 60,
      description: 'Rodillas al pecho en alternancia rápida',
      tip: 'Hombros sobre las muñecas, caderas sin subir' },
    { name: 'Abdominales bicicleta', type: 'reps', reps: 25,
      description: 'Codo hacia rodilla opuesta — lento y controlado' },
    { name: 'Plancha', type: 'timed', duration: 45,
      description: 'Core apretado, espalda plana, respirá' },
    { name: 'Russian twists', type: 'reps', reps: 20,
      description: 'Con botella llena — rotá tocando el piso a cada lado',
      tip: 'Apoyá los pies si necesitás mantener una postura estable' },
    { name: 'Mountain climbers final', type: 'timed', duration: 45,
      description: 'Cerrá la ronda con un ritmo que te permita mantener la técnica' }
  ];

  for (let r = 1; r <= safeRounds; r++) {
    const sectionLabel = `Bloque 3: Core — Ronda ${r}/${safeRounds}`;
    coreExercises.forEach(exercise => {
      add({ ...exercise, section: sectionLabel, round: r, totalRounds: safeRounds });
    });
    if (r < safeRounds) {
      add({ name: 'Descanso entre rondas', section: sectionLabel, type: 'rest', duration: 60,
            description: 'Recuperá el aire y retomá cuando puedas mantener buena técnica' });
    }
  }

  // ── ENFRIAMIENTO (7 min) — same steps as Day A ───────────────────────────
  add({ name: 'Estiramiento de cuádriceps y flexores de cadera', section: 'Enfriamiento', type: 'timed', duration: 60,
        description: 'De pie, llevá el talón al glúteo 30 seg por lado. Luego rodilla en tierra, empujá la cadera hacia adelante',
        tip: 'Mantené la posición sin rebotar' });
  add({ name: 'Estiramiento de isquiotibiales', section: 'Enfriamiento', type: 'timed', duration: 60,
        description: 'Sentado en el piso, piernas extendidas. Inclinás el tronco hacia adelante manteniendo la espalda recta',
        tip: 'No importa cuánto llegás, importa mantener la espalda larga' });
  add({ name: 'Estiramiento de hombros y pecho', section: 'Enfriamiento', type: 'timed', duration: 60,
        description: 'Cruzá un brazo al pecho y sostené 30 seg. Luego entrelazá manos atrás y abrí el pecho',
        tip: 'Respirá profundo en cada posición' });
  add({ name: 'Estiramiento de espalda', section: 'Enfriamiento', type: 'timed', duration: 60,
        description: 'En cuatro patas: posición del niño 30 seg, luego gato-vaca 30 seg (arquear y redondear la espalda)' });
  add({ name: 'Respiración profunda', section: 'Enfriamiento', type: 'timed', duration: 120,
        description: 'Acostado boca arriba. Inhalá 4 seg por la nariz, aguantá 4 seg, exhalá 6 seg por la boca',
        tip: 'La exhalación larga activa el sistema nervioso parasimpático — bajás las pulsaciones más rápido' });

  return steps;
}

// ─── WORKOUT SUMMARY (for static display) ────────────────────────────────────

const WORKOUT_SUMMARY_A = [
  {
    section: 'Calentamiento',
    duration: '10 min',
    exercises: [
      'Saltando cuerda: 2 min',
      'Jumping jacks: 1 min',
      'Skipping en el lugar: 1 min',
      'Movilidad articular (cintura, cadera, hombros, tobillos): 3 min',
      'Shadow boxing suave: 2 min',
      'Estiramientos dinámicos: 1 min'
    ]
  },
  {
    section: 'Circuito 1: Piernas y Glúteos',
    duration: '12-15 min · 2-3 rondas',
    note: '💡 Fuerza primero — energía fresca para el estímulo muscular',
    exercises: [
      'Sentadilla lenta (3 seg bajando): 10 reps',
      'Puente de glúteos con pausa (2 seg arriba): 15 reps',
      'Zancada reversa con pausa: 8 reps por pierna',
      'Sentadilla sumo: 12 reps',
      'Descanso entre rondas: 90 seg'
    ]
  },
  {
    section: 'Circuito 2: Tren Superior',
    duration: '12-15 min · 2-3 rondas',
    note: '💡 Push + Pull — ahora sí hay trabajo de espalda y bíceps',
    exercises: [
      'Flexión de brazos lenta (3 seg bajando): 10 reps',
      'Remo invertido con mesa: 12 reps',
      'Fondos en banco/silla: 12 reps',
      'Curl de bíceps con mancuernas/botellas: 12 reps',
      'Descanso entre rondas: 90 seg'
    ]
  },
  {
    section: 'Circuito 3: Core y Boxeo',
    duration: '10-12 min · 2-3 rondas',
    exercises: [
      'Bolsa de boxeo (combinaciones + desplazamientos): 2 min',
      'Plancha: 45 seg',
      'Abdominales bicicleta (lento y controlado): 20 reps',
      'Russian twists con botella: 20 reps',
      'Mountain climbers: 45 seg',
      'Descanso entre rondas: 1 min'
    ]
  },
  {
    section: 'Cardio Final',
    duration: '8-10 min',
    note: '💡 Cardio al final — la grasa se quema con el músculo ya trabajado',
    exercises: [
      'Bicicleta fija — intervalos (40 seg máximo / 20 seg suave × 4): 4 min',
      'Salto de cuerda rápido: 90 seg',
      'Burpees × 2 series de 30 seg (20 seg descanso entre series)'
    ]
  },
  {
    section: 'Enfriamiento',
    duration: '7 min',
    exercises: [
      'Estiramiento de cuádriceps y flexores de cadera: 1 min',
      'Estiramiento de isquiotibiales: 1 min',
      'Estiramiento de hombros y pecho: 1 min',
      'Estiramiento de espalda (posición del niño + gato-vaca): 1 min',
      'Respiración profunda (inhalá 4, aguantá 4, exhalá 6): 2 min'
    ]
  }
];

const WORKOUT_SUMMARY_B = [
  {
    section: 'Calentamiento',
    duration: '8 min',
    exercises: [
      'Saltando cuerda: 2 min',
      'Jumping jacks: 1 min',
      'Skipping: 1 min',
      'Shadow boxing suave: 2 min',
      'Movilidad articular: 2 min'
    ]
  },
  {
    section: 'Bloque 1: Boxeo',
    duration: '15 min · 4 rounds',
    note: '💡 2 min de bolsa + 1 min descanso — como rounds reales de boxeo',
    exercises: [
      'Round 1 — Volumen: jabs y crosses',
      'Round 2 — Potencia: ganchos y uppercuts',
      'Round 3 — Combinaciones mixtas + desplazamientos',
      'Round 4 — ¡Todo lo que tenés!'
    ]
  },
  {
    section: 'Bloque 2: Cardio Intervals',
    duration: '12 min',
    note: '💡 Sin descanso entre bloques — máxima quema',
    exercises: [
      'Bicicleta fija intervalos (40s/20s × 4): 4 min',
      'Salto de cuerda sostenido: 2 min',
      'Burpees × 3 series de 30s',
      'Saltos laterales: 1 min',
      'Salto de cuerda final: 90s'
    ]
  },
  {
    section: 'Bloque 3: Core',
    duration: '8 min',
    exercises: [
      'Mountain climbers: 60s',
      'Abdominales bicicleta: 25 reps',
      'Plancha: 45s',
      'Russian twists: 20 reps',
      'Mountain climbers final: 45s'
    ]
  },
  {
    section: 'Enfriamiento',
    duration: '7 min',
    exercises: [
      'Estiramiento de cuádriceps y flexores: 1 min',
      'Estiramiento de isquiotibiales: 1 min',
      'Estiramiento de hombros y pecho: 1 min',
      'Estiramiento de espalda: 1 min',
      'Respiración profunda: 2 min'
    ]
  }
];

/**
 * Returns the Day B summary adjusted to the selected progression level.
 * @param {number} rounds - Progressive cardio/core rounds (1 to 3)
 * @returns {Array} Workout summary sections
 */
function getWorkoutSummaryB(rounds = 2) {
  const safeRounds = Math.min(3, Math.max(1, parseInt(rounds, 10) || 2));
  const bikeIntervals = safeRounds + 1;
  const cardioMinutes = [0, 7, 9, 11][safeRounds];
  const coreMinutes = [0, 4, 9, 14][safeRounds];

  return WORKOUT_SUMMARY_B.map((section, index) => {
    if (index === 2) {
      return {
        ...section,
        duration: `~${cardioMinutes} min`,
        note: '💡 El volumen aumenta de forma gradual y conserva pausas de recuperación',
        exercises: [
          `Bicicleta fija (40s fuerte / 20s suave × ${bikeIntervals}): ${bikeIntervals} min`,
          'Salto de cuerda sostenido: 2 min',
          `Burpees × ${safeRounds} ${safeRounds === 1 ? 'serie' : 'series'} de 30s`,
          'Saltos laterales: 1 min',
          'Salto de cuerda final: 90s'
        ]
      };
    }

    if (index === 3) {
      return {
        ...section,
        duration: `~${coreMinutes} min · ${safeRounds} ${safeRounds === 1 ? 'ronda' : 'rondas'}`,
        note: '💡 Descanso de 1 min entre rondas para mantener una técnica estable'
      };
    }

    return section;
  });
}

// Backward-compat alias — code that reads WORKOUT_SUMMARY still works.
const WORKOUT_SUMMARY = WORKOUT_SUMMARY_A;

/**
 * Returns the suggested number of rounds based on weeks elapsed since program start.
 * Week 1-2 → 2 rounds, Week 3+ → 3 rounds.
 * @param {string} startDateStr - ISO date string (YYYY-MM-DD) of the program start date
 * @returns {number} Suggested rounds (2 or 3)
 */
function getSuggestedRounds(startDateStr) {
  if (!startDateStr) return 2;
  const d = new Date(startDateStr);
  if (isNaN(d.getTime())) return 2;
  const days = Math.floor((new Date() - d) / 86400000);
  if (days < 0) return 2;
  const week = Math.floor(days / 7) + 1;
  if (week <= 2) return 2;
  return 3;
}
