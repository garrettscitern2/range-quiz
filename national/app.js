// ============================================================
// CONFIGURATION
// ============================================================

const QUIZ_SET = 'national'; // used when saving scores to Supabase (Phase 3)

const QUIZ_CONFIG = {
  mode:      'immediate', // 'immediate' | 'end-review' (future)
  filter:    'all',       // 'all' | 'Grass' | 'Forb' | 'Legume' | 'Woody'
  count:     null,        // null = all in filtered set; number = random subset
  randomize: true         // true = shuffle; false = in-order by ID
};

// ============================================================
// PLANT DATA  (source: national-plants.json — 100 plants)
// category: Grass | Legume | Forb | Woody
// stature: Short | Mid | Tall | null (null for non-Grasses)
// lifecycle: Annual | Perennial  |  season: Warm | Cool
// origin_native_status: Native | Introduced
// origin_invasive_status: Invasive | null (null = Non-Invasive)
// bobwhite_quail_food / _cover / cattle_food: Desirable | Undesirable
// ============================================================

const PLANTS = [
  {"id":2,"name":"Annual Threeawn","category":"Grass","stature":"Short","lifecycle":"Annual","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Undesirable"},
  {"id":3,"name":"Bermudagrass","category":"Grass","stature":"Short","lifecycle":"Perennial","season":"Warm","origin_native_status":"Introduced","origin_invasive_status":"Invasive","bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Desirable"},
  {"id":4,"name":"Big or Sand Bluestem","category":"Grass","stature":"Tall","lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":5,"name":"Blue Grama","category":"Grass","stature":"Short","lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Desirable"},
  {"id":7,"name":"Brome","category":"Grass","stature":"Short","lifecycle":"Annual","season":"Cool","origin_native_status":"Introduced","origin_invasive_status":"Invasive","bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Undesirable"},
  {"id":8,"name":"Broomsedge Bluestem","category":"Grass","stature":"Tall","lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":9,"name":"Buffalograss","category":"Grass","stature":"Short","lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Desirable"},
  {"id":10,"name":"Canada Wild rye","category":"Grass","stature":"Mid","lifecycle":"Perennial","season":"Cool","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":11,"name":"Eastern Gamagrass","category":"Grass","stature":"Tall","lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":14,"name":"Hairy Grama","category":"Grass","stature":"Short","lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Desirable"},
  {"id":15,"name":"Indiangrass","category":"Grass","stature":"Tall","lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":17,"name":"Johnsongrass","category":"Grass","stature":"Tall","lifecycle":"Perennial","season":"Warm","origin_native_status":"Introduced","origin_invasive_status":"Invasive","bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":18,"name":"Little Barley","category":"Grass","stature":"Short","lifecycle":"Annual","season":"Cool","origin_native_status":"Introduced","origin_invasive_status":"Invasive","bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Undesirable"},
  {"id":19,"name":"Little Bluestem","category":"Grass","stature":"Tall","lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":20,"name":"Old World Bluestem","category":"Grass","stature":"Mid","lifecycle":"Perennial","season":"Warm","origin_native_status":"Introduced","origin_invasive_status":"Invasive","bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Desirable"},
  {"id":21,"name":"Perennial Threeawn","category":"Grass","stature":"Mid","lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Undesirable"},
  {"id":24,"name":"Prairie Sedge","category":"Grass","stature":"Short","lifecycle":"Perennial","season":"Cool","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Desirable"},
  {"id":25,"name":"Purpletop","category":"Grass","stature":"Tall","lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":27,"name":"Sand Dropseed","category":"Grass","stature":"Mid","lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":28,"name":"Sand Lovegrass","category":"Grass","stature":"Mid","lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Desirable"},
  {"id":29,"name":"Scribner Panicum","category":"Grass","stature":"Short","lifecycle":"Perennial","season":"Cool","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Desirable"},
  {"id":30,"name":"Sideoats Grama","category":"Grass","stature":"Mid","lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":31,"name":"Silver Bluestem","category":"Grass","stature":"Mid","lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":32,"name":"Splitbeard Bluestem","category":"Grass","stature":"Mid","lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":33,"name":"Switchgrass","category":"Grass","stature":"Tall","lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":34,"name":"Tall Dropseed","category":"Grass","stature":"Tall","lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":35,"name":"Tall Fescue","category":"Grass","stature":"Mid","lifecycle":"Perennial","season":"Cool","origin_native_status":"Introduced","origin_invasive_status":"Invasive","bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Desirable"},
  {"id":36,"name":"Texas Bluegrass","category":"Grass","stature":"Mid","lifecycle":"Perennial","season":"Cool","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Desirable"},
  {"id":39,"name":"Western Wheatgrass","category":"Grass","stature":"Mid","lifecycle":"Perennial","season":"Cool","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":40,"name":"Catclaw Sensitivebriar","category":"Legume","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":41,"name":"Groundplum","category":"Legume","stature":null,"lifecycle":"Perennial","season":"Cool","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Desirable"},
  {"id":42,"name":"Hairy Vetch","category":"Legume","stature":null,"lifecycle":"Annual","season":"Cool","origin_native_status":"Introduced","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Desirable"},
  {"id":43,"name":"Illinois Bundleflower","category":"Legume","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":44,"name":"Leadplant","category":"Legume","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":45,"name":"Prairie Acacia","category":"Legume","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":46,"name":"Purple Prairie Clover","category":"Legume","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":47,"name":"Roundhead Lespedeza","category":"Legume","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":48,"name":"Scurfpea","category":"Legume","stature":null,"lifecycle":"Perennial","season":"Cool","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":49,"name":"Sericea Lespedeza","category":"Legume","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Introduced","origin_invasive_status":"Invasive","bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Undesirable"},
  {"id":50,"name":"Sessile-leaved Tickclover","category":"Legume","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":51,"name":"Slender Dalea","category":"Legume","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":52,"name":"Slender Lespedeza","category":"Legume","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":54,"name":"Trailing Wildbean","category":"Legume","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":56,"name":"Wild Indigo","category":"Legume","stature":null,"lifecycle":"Perennial","season":"Cool","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":57,"name":"Woolly Loco","category":"Legume","stature":null,"lifecycle":"Perennial","season":"Cool","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Undesirable"},
  {"id":58,"name":"Yellow Neptune","category":"Legume","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":59,"name":"Annual Sunflower","category":"Forb","stature":null,"lifecycle":"Annual","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":60,"name":"Antelopehorn Milkweed","category":"Forb","stature":null,"lifecycle":"Perennial","season":"Cool","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":61,"name":"Ashy Sunflower","category":"Forb","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":64,"name":"Blackeyed Susan","category":"Forb","stature":null,"lifecycle":"Annual","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":65,"name":"Blacksamson","category":"Forb","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":67,"name":"Common Broomweed","category":"Forb","stature":null,"lifecycle":"Annual","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":68,"name":"Compass Plant","category":"Forb","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":69,"name":"Croton","category":"Forb","stature":null,"lifecycle":"Annual","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":71,"name":"Daisy Fleabane","category":"Forb","stature":null,"lifecycle":"Annual","season":"Cool","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":72,"name":"Dotted Gayfeather","category":"Forb","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":74,"name":"Giant Ragweed","category":"Forb","stature":null,"lifecycle":"Annual","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":75,"name":"Goat's Beard","category":"Forb","stature":null,"lifecycle":"Annual","season":"Cool","origin_native_status":"Introduced","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Undesirable"},
  {"id":76,"name":"Goldenrod","category":"Forb","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":77,"name":"Halfshrub Sundrop","category":"Forb","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":78,"name":"Heath Aster","category":"Forb","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":79,"name":"Horseweed","category":"Forb","stature":null,"lifecycle":"Annual","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":82,"name":"Maximilian Sunflower","category":"Forb","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":83,"name":"Mexican Hat","category":"Forb","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":84,"name":"Pepperweed","category":"Forb","stature":null,"lifecycle":"Annual","season":"Cool","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Desirable"},
  {"id":85,"name":"Pitcher Sage","category":"Forb","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Desirable"},
  {"id":86,"name":"Plains Yucca","category":"Forb","stature":null,"lifecycle":"Perennial","season":"Cool","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":87,"name":"Prickly Pear Cactus","category":"Forb","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":"Invasive","bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":88,"name":"Sagewort","category":"Forb","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":90,"name":"Snow-on-the-mountain","category":"Forb","stature":null,"lifecycle":"Annual","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":93,"name":"Violet Wood Sorrel","category":"Forb","stature":null,"lifecycle":"Annual","season":"Cool","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Undesirable"},
  {"id":94,"name":"Wax Goldenweed","category":"Forb","stature":null,"lifecycle":"Annual","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":95,"name":"Western Ironweed","category":"Forb","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":96,"name":"Western Ragweed","category":"Forb","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":97,"name":"White Snakeroot","category":"Forb","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":98,"name":"Yarrow","category":"Forb","stature":null,"lifecycle":"Perennial","season":"Cool","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Undesirable"},
  {"id":99,"name":"Yellow Puccoon","category":"Forb","stature":null,"lifecycle":"Perennial","season":"Cool","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":101,"name":"American Elm","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Desirable"},
  {"id":103,"name":"Blackjack Oak","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":104,"name":"Buckbrush","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":105,"name":"Buttonbush","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":106,"name":"Chittamwood","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":107,"name":"Eastern Cottonwood","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Desirable"},
  {"id":108,"name":"Eastern Redcedar","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Cool","origin_native_status":"Native","origin_invasive_status":"Invasive","bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Undesirable","cattle_food":"Undesirable"},
  {"id":109,"name":"False Indigo","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":110,"name":"Fragrant Sumac","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":111,"name":"Greenbrier","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":112,"name":"Hackberry","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":115,"name":"Oklahoma Blackberry","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":"Invasive","bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":116,"name":"Osage Orange","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":118,"name":"Poison-ivy","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":119,"name":"Post Oak","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":120,"name":"Redbud","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":121,"name":"Rough-leaf Dogwood","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":123,"name":"Sand Plum","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":126,"name":"Soapberry","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":127,"name":"Southern Blackhaw","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":128,"name":"Sumac","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Undesirable"},
  {"id":129,"name":"Virginia Creeper","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":null,"bobwhite_quail_food":"Desirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
  {"id":130,"name":"Winged Elm","category":"Woody","stature":null,"lifecycle":"Perennial","season":"Warm","origin_native_status":"Native","origin_invasive_status":"Invasive","bobwhite_quail_food":"Undesirable","bobwhite_quail_cover":"Desirable","cattle_food":"Desirable"},
];

// ============================================================
// STATE
// ============================================================

let state = {
  queue: [],
  index: 0,
  submitted: false,
  answers: {},
  score: { plants: 0, chars: 0, charsTotal: 0 }
};

// ============================================================
// UTILITIES
// ============================================================

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getCategories(plant) {
  const cats = [
    {
      key: 'lifecycle',
      label: 'Lifecycle',
      options: [{ v: 'Annual', l: 'Annual' }, { v: 'Perennial', l: 'Perennial' }]
    },
    {
      key: 'season',
      label: 'Season',
      options: [{ v: 'Warm', l: 'Warm' }, { v: 'Cool', l: 'Cool' }]
    },
    {
      key: 'origin_native_status',
      label: 'Origin',
      options: [{ v: 'Native', l: 'Native' }, { v: 'Introduced', l: 'Introduced' }]
    },
    {
      key: 'origin_invasive_status',
      label: 'Invasive',
      options: [{ v: 'Invasive', l: 'Invasive' }, { v: 'Non-Invasive', l: 'Non-Invasive' }]
    },
    {
      key: 'bobwhite_quail_food',
      label: 'Quail Food',
      options: [{ v: 'Desirable', l: 'Desirable' }, { v: 'Undesirable', l: 'Undesirable' }]
    },
    {
      key: 'bobwhite_quail_cover',
      label: 'Quail Cover',
      options: [{ v: 'Desirable', l: 'Desirable' }, { v: 'Undesirable', l: 'Undesirable' }]
    },
    {
      key: 'cattle_food',
      label: 'Cattle Food',
      options: [{ v: 'Desirable', l: 'Desirable' }, { v: 'Undesirable', l: 'Undesirable' }]
    },
  ];
  if (plant.stature !== null) {
    cats.unshift({
      key: 'stature',
      label: 'Stature',
      options: [{ v: 'Short', l: 'Short' }, { v: 'Mid', l: 'Mid' }, { v: 'Tall', l: 'Tall' }]
    });
  }
  return cats;
}

// Returns the plant's correct answer as a string (to match option values)
function getCorrectValue(plant, key) {
  if (key === 'origin_invasive_status') return plant[key] || 'Non-Invasive';
  return plant[key];
}

// ============================================================
// RENDER
// ============================================================

function selIf(configKey, btnValue) {
  const configVal = QUIZ_CONFIG[configKey];
  const configStr = configVal === null ? 'null' : String(configVal);
  return configStr === btnValue ? ' selected' : '';
}

function parseSettingValue(setting, raw) {
  if (setting === 'randomize') return raw === 'true';
  if (setting === 'count') return raw === 'null' ? null : parseInt(raw, 10);
  return raw;
}

function renderStart() {
  const available = QUIZ_CONFIG.filter === 'all'
    ? PLANTS.length
    : PLANTS.filter(p => p.category === QUIZ_CONFIG.filter).length;

  return `
    <div class="start-screen">
      <header class="start-header">
        <div class="start-title">Range Quiz</div>
        <div class="start-subtitle">Range Plant Contest Prep</div>
      </header>

      <div class="settings-card">
        <div class="settings-section">
          <div class="settings-label">Order</div>
          <div class="settings-group">
            <button class="setting-btn${selIf('randomize', 'true')}"  data-setting="randomize" data-value="true">Shuffled</button>
            <button class="setting-btn${selIf('randomize', 'false')}" data-setting="randomize" data-value="false">In Order</button>
          </div>
        </div>

        <div class="settings-section">
          <div class="settings-label">Plant Type</div>
          <div class="settings-group">
            <button class="setting-btn${selIf('filter', 'all')}"    data-setting="filter" data-value="all">All</button>
            <button class="setting-btn${selIf('filter', 'Grass')}"  data-setting="filter" data-value="Grass">Grass</button>
            <button class="setting-btn${selIf('filter', 'Forb')}"   data-setting="filter" data-value="Forb">Forb</button>
            <button class="setting-btn${selIf('filter', 'Legume')}" data-setting="filter" data-value="Legume">Legume</button>
            <button class="setting-btn${selIf('filter', 'Woody')}"  data-setting="filter" data-value="Woody">Woody</button>
          </div>
        </div>

        <div class="settings-section">
          <div class="settings-label">Quiz Length</div>
          <div class="settings-group">
            <button class="setting-btn${selIf('count', 'null')}" data-setting="count" data-value="null">All</button>
            <button class="setting-btn${selIf('count', '10')}"   data-setting="count" data-value="10">10</button>
            <button class="setting-btn${selIf('count', '20')}"   data-setting="count" data-value="20">20</button>
            <button class="setting-btn${selIf('count', '30')}"   data-setting="count" data-value="30">30</button>
            <button class="setting-btn${selIf('count', '50')}"   data-setting="count" data-value="50">50</button>
          </div>
          <div class="available-count">${available} plant${available !== 1 ? 's' : ''} available</div>
        </div>

        <div class="action-area">
          <button id="start-btn" class="action-btn">Start Quiz</button>
        </div>
        <div class="auth-signout">
          <a href="/dashboard.html" class="auth-signout-btn">Dashboard</a>
          &nbsp;·&nbsp;
          <button id="signout-btn" class="auth-signout-btn">Sign out</button>
        </div>
      </div>
    </div>
  `;
}

function startScreen() {
  document.getElementById('start-btn').addEventListener('click', initQuiz);

  document.getElementById('signout-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth.html';
  });

  document.querySelectorAll('.settings-group').forEach(group => {
    group.addEventListener('click', e => {
      const btn = e.target.closest('.setting-btn');
      if (!btn) return;
      const setting = btn.dataset.setting;
      QUIZ_CONFIG[setting] = parseSettingValue(setting, btn.dataset.value);
      group.querySelectorAll('.setting-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (setting === 'filter') {
        const available = QUIZ_CONFIG.filter === 'all'
          ? PLANTS.length
          : PLANTS.filter(p => p.category === QUIZ_CONFIG.filter).length;
        document.querySelector('.available-count').textContent =
          `${available} plant${available !== 1 ? 's' : ''} available`;
      }
    });
  });
}

function render() {
  const app = document.getElementById('app');
  if (state.index >= state.queue.length) {
    saveQuizSession(); // fire-and-forget — does not block UI
    app.innerHTML = renderResults();
    document.getElementById('change-settings-btn').addEventListener('click', () => {
      app.innerHTML = renderStart();
      startScreen();
    });
    document.getElementById('play-again-btn').addEventListener('click', initQuiz);
    return;
  }
  app.innerHTML = renderQuiz();
  document.getElementById('characteristics').addEventListener('click', handleChoiceClick);
  document.getElementById('action-btn').addEventListener('click', handleActionClick);
}

function renderQuiz() {
  const plant = state.queue[state.index];
  const total = state.queue.length;
  const pct = (state.index / total) * 100;
  const cats = getCategories(plant);
  const typeLabel = plant.category;

  return `
    <div class="quiz-screen">
      <header class="quiz-header">
        <div class="header-top">
          <span class="quiz-title">Range Quiz</span>
          <span class="progress-count">${state.index + 1}&thinsp;/&thinsp;${total}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="score-line">
          ${state.score.plants} plant${state.score.plants !== 1 ? 's' : ''} fully correct
        </div>
      </header>

      <div class="card">
        <div class="type-badge ${plant.category.toLowerCase()}">${typeLabel}</div>
        <h2 class="plant-name">${plant.name}</h2>

        <div class="characteristics" id="characteristics">
          ${cats.map(cat => `
            <div class="char-row">
              <span class="char-label">${cat.label}</span>
              <div class="btn-group">
                ${cat.options.map(opt => `
                  <button class="choice-btn" data-category="${cat.key}" data-value="${opt.v}">${opt.l}</button>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="action-area">
          <button id="action-btn" class="action-btn" disabled>Submit</button>
        </div>
      </div>
    </div>
  `;
}

function renderResults() {
  const total = state.queue.length;
  const plantPct = total > 0 ? Math.round((state.score.plants / total) * 100) : 0;
  const charPct  = state.score.charsTotal > 0
    ? Math.round((state.score.chars / state.score.charsTotal) * 100)
    : 0;

  let grade, gradeClass;
  if (charPct >= 90)      { grade = 'Excellent';    gradeClass = 'grade-a'; }
  else if (charPct >= 75) { grade = 'Good';         gradeClass = 'grade-b'; }
  else if (charPct >= 60) { grade = 'Keep Studying'; gradeClass = 'grade-c'; }
  else                    { grade = 'Needs Work';   gradeClass = 'grade-d'; }

  return `
    <div class="results-screen">
      <div class="results-card">
        <div class="results-grade ${gradeClass}">${grade}</div>
        <h2 class="results-title">Quiz Complete</h2>

        <div class="score-grid">
          <div class="score-item">
            <div class="score-value">${state.score.plants}&thinsp;/&thinsp;${total}</div>
            <div class="score-label">Plants 100% correct</div>
          </div>
          <div class="score-item">
            <div class="score-value">${state.score.chars}&thinsp;/&thinsp;${state.score.charsTotal}</div>
            <div class="score-label">Characteristics correct</div>
          </div>
        </div>

        <div class="score-pct ${gradeClass}">${charPct}%</div>
        <div class="score-pct-label">characteristic accuracy</div>

        <div class="results-buttons">
          <button id="change-settings-btn" class="action-btn secondary-btn">Change Settings</button>
          <button id="play-again-btn" class="action-btn">Play Again</button>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// EVENT HANDLERS
// ============================================================

function handleChoiceClick(e) {
  const btn = e.target.closest('.choice-btn');
  if (!btn || state.submitted) return;

  const category = btn.dataset.category;

  // Deselect sibling buttons in the same category
  document.querySelectorAll(`.choice-btn[data-category="${category}"]`)
    .forEach(b => b.classList.remove('selected'));

  btn.classList.add('selected');
  state.answers[category] = btn.dataset.value;

  checkSubmitEnabled();
}

function checkSubmitEnabled() {
  const plant = state.queue[state.index];
  const cats = getCategories(plant);
  const allAnswered = cats.every(cat => state.answers[cat.key] !== undefined);
  document.getElementById('action-btn').disabled = !allAnswered;
}

function handleActionClick() {
  if (!state.submitted) {
    submitAnswers();
  } else {
    nextPlant();
  }
}

function submitAnswers() {
  const plant = state.queue[state.index];
  const cats  = getCategories(plant);
  state.submitted = true;

  let plantCorrect = true;
  let charRight = 0;

  cats.forEach(cat => {
    const correctVal = getCorrectValue(plant, cat.key);
    const userVal    = state.answers[cat.key];
    const isCorrect  = userVal === correctVal;

    if (!isCorrect) plantCorrect = false;
    else charRight++;

    document.querySelectorAll(`.choice-btn[data-category="${cat.key}"]`).forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.value === correctVal) {
        btn.classList.add('correct');
        btn.classList.remove('selected');
      } else if (btn.dataset.value === userVal && !isCorrect) {
        btn.classList.add('incorrect');
        btn.classList.remove('selected');
      }
    });
  });

  state.score.chars      += charRight;
  state.score.charsTotal += cats.length;
  if (plantCorrect) state.score.plants++;

  state.attempts.push({
    plant_id:          plant.id,
    plant_name:        plant.name,
    was_fully_correct: plantCorrect,
    chars_correct:     charRight,
    chars_total:       cats.length
  });

  const actionBtn = document.getElementById('action-btn');
  const isLast    = state.index >= state.queue.length - 1;
  actionBtn.textContent = isLast ? 'See Results' : 'Next Plant →';
  actionBtn.disabled    = false;
  if (plantCorrect) actionBtn.classList.add('correct-btn');
}

async function saveQuizSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: saved, error } = await supabase
      .from('quiz_sessions')
      .insert({
        user_id:         session.user.id,
        quiz_set:        QUIZ_SET,
        filter_category: QUIZ_CONFIG.filter === 'all' ? null : QUIZ_CONFIG.filter,
        question_count:  state.queue.length,
        plants_correct:  state.score.plants,
        chars_correct:   state.score.chars,
        chars_total:     state.score.charsTotal,
        mode:            QUIZ_CONFIG.mode
      })
      .select('id')
      .single();

    if (error || !saved) { console.error('quiz_sessions insert failed:', error); return; }

    await supabase.from('plant_attempts').insert(
      state.attempts.map(a => ({
        session_id:        saved.id,
        user_id:           session.user.id,
        quiz_set:          QUIZ_SET,
        plant_id:          a.plant_id,
        plant_name:        a.plant_name,
        was_fully_correct: a.was_fully_correct,
        chars_correct:     a.chars_correct,
        chars_total:       a.chars_total
      }))
    );
  } catch (err) {
    console.error('saveQuizSession failed:', err);
  }
}

function nextPlant() {
  state.index++;
  state.submitted = false;
  state.answers   = {};
  render();
}

// ============================================================
// INIT
// ============================================================

function initQuiz() {
  let pool = [...PLANTS];
  if (QUIZ_CONFIG.filter !== 'all') pool = pool.filter(p => p.category === QUIZ_CONFIG.filter);
  if (QUIZ_CONFIG.randomize) shuffle(pool);
  if (QUIZ_CONFIG.count !== null) pool = pool.slice(0, QUIZ_CONFIG.count);
  state = {
    queue:     pool,
    index:     0,
    submitted: false,
    answers:   {},
    score:     { plants: 0, chars: 0, charsTotal: 0 },
    attempts:  []
  };
  render();
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Guard: must be logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      sessionStorage.setItem('authRedirect', location.href);
      window.location.href = '/auth.html';
      return;
    }
    // Guard: must have subscription access
    const canAccess = await checkSubscriptionAccess(session.user.id);
    if (!canAccess) {
      sessionStorage.setItem('authRedirect', location.href);
      window.location.href = '/auth.html?reason=no_subscription';
      return;
    }
    const app = document.getElementById('app');
    app.innerHTML = renderStart();
    startScreen();
  } catch (err) {
    console.error('Auth guard error:', err);
    sessionStorage.setItem('authRedirect', location.href);
    window.location.href = '/auth.html';
  }
});
