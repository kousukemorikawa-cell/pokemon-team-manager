(() => {
  const DB_NAME='pokemon-team-manager-v1', STORE='app';
  const state={teams:[], imageMap:{}, seasons:['未分類'], currentSeason:'all', teamScope:'world', filter:'all', query:'', currentId:null, currentPokemon:'', detailReturn:null};
  const DEFAULT_FIREBASE_CONFIG={
    apiKey:'AIzaSyD08arPFpMjPkTUgKoTs4q1QbxsJWXk1q4',
    authDomain:'pokemon-team-manager-c9895.firebaseapp.com',
    projectId:'pokemon-team-manager-c9895',
    storageBucket:'pokemon-team-manager-c9895.firebasestorage.app',
    messagingSenderId:'459230268500',
    appId:'1:459230268500:web:392b6fbf8bcc83520eb1c1',
    measurementId:'G-E8B12XEVJE'
  };
  const cloud={configured:false,user:null,auth:null,db:null,storage:null,api:null,saving:false};
  let cloudSaveTimer=null;
  const TAGS={
    none:{label:'タグなし',emoji:'⚪',color:'#c7cbd3'},
    red:{label:'現在注目している構築',emoji:'🔴',color:'#e53935'},
    blue:{label:'試用',emoji:'🔵',color:'#1e88e5'},
    green:{label:'上位構築',emoji:'🟢',color:'#43a047'},
    purple:{label:'要研究構築',emoji:'🟣',color:'#8e24aa'}
  };
  const POKEMON_FORM_SLUGS={
    'メガフシギバナ':'venusaur-mega','メガリザードンX':'charizard-mega-x','メガリザードンY':'charizard-mega-y','メガカメックス':'blastoise-mega','メガスピアー':'beedrill-mega','メガピジョット':'pidgeot-mega','メガフーディン':'alakazam-mega','メガヤドラン':'slowbro-mega','メガゲンガー':'gengar-mega','メガガルーラ':'kangaskhan-mega','メガカイロス':'pinsir-mega','メガギャラドス':'gyarados-mega','メガプテラ':'aerodactyl-mega','メガミュウツーX':'mewtwo-mega-x','メガミュウツーY':'mewtwo-mega-y','メガデンリュウ':'ampharos-mega','メガハガネール':'steelix-mega','メガハッサム':'scizor-mega','メガヘラクロス':'heracross-mega','メガヘルガー':'houndoom-mega','メガバンギラス':'tyranitar-mega','メガジュカイン':'sceptile-mega','メガバシャーモ':'blaziken-mega','メガラグラージ':'swampert-mega','メガサーナイト':'gardevoir-mega','メガヤミラミ':'sableye-mega','メガクチート':'mawile-mega','メガボスゴドラ':'aggron-mega','メガチャーレム':'medicham-mega','メガライボルト':'manectric-mega','メガサメハダー':'sharpedo-mega','メガバクーダ':'camerupt-mega','メガチルタリス':'altaria-mega','メガジュペッタ':'banette-mega','メガアブソル':'absol-mega','メガオニゴーリ':'glalie-mega','メガボーマンダ':'salamence-mega','メガメタグロス':'metagross-mega','メガラティアス':'latias-mega','メガラティオス':'latios-mega','ゲンシカイオーガ':'kyogre-primal','ゲンシグラードン':'groudon-primal','メガレックウザ':'rayquaza-mega','メガミミロップ':'lopunny-mega','メガガブリアス':'garchomp-mega','メガルカリオ':'lucario-mega','メガユキノオー':'abomasnow-mega','メガエルレイド':'gallade-mega','メガタブンネ':'audino-mega','メガディアンシー':'diancie-mega',
    'アローラライチュウ':'raichu-alola','アローラサンド':'sandshrew-alola','アローラサンドパン':'sandslash-alola','アローラロコン':'vulpix-alola','アローラキュウコン':'ninetales-alola','アローラディグダ':'diglett-alola','アローラダグトリオ':'dugtrio-alola','アローラニャース':'meowth-alola','アローラペルシアン':'persian-alola','アローライシツブテ':'geodude-alola','アローラゴローン':'graveler-alola','アローラゴローニャ':'golem-alola','アローラベトベター':'grimer-alola','アローラベトベトン':'muk-alola','アローラナッシー':'exeggutor-alola','アローラガラガラ':'marowak-alola',
    'ガラルニャース':'meowth-galar','ガラルポニータ':'ponyta-galar','ガラルギャロップ':'rapidash-galar','ガラルヤドン':'slowpoke-galar','ガラルヤドラン':'slowbro-galar','ガラルカモネギ':'farfetchd-galar','ガラルマタドガス':'weezing-galar','ガラルバリヤード':'mr-mime-galar','ガラルフリーザー':'articuno-galar','ガラルサンダー':'zapdos-galar','ガラルファイヤー':'moltres-galar','ガラルヤドキング':'slowking-galar','ガラルサニーゴ':'corsola-galar','ガラルジグザグマ':'zigzagoon-galar','ガラルマッスグマ':'linoone-galar','ガラルダルマッカ':'darumaka-galar','ガラルヒヒダルマ':'darmanitan-galar-standard','ガラルデスマス':'yamask-galar','ガラルマッギョ':'stunfisk-galar',
    'ヒスイガーディ':'growlithe-hisui','ヒスイウインディ':'arcanine-hisui','ヒスイビリリダマ':'voltorb-hisui','ヒスイマルマイン':'electrode-hisui','ヒスイバクフーン':'typhlosion-hisui','ヒスイハリーセン':'qwilfish-hisui','ヒスイニューラ':'sneasel-hisui','ヒスイダイケンキ':'samurott-hisui','ヒスイドレディア':'lilligant-hisui','ヒスイゾロア':'zorua-hisui','ヒスイゾロアーク':'zoroark-hisui','ヒスイウォーグル':'braviary-hisui','ヒスイヌメイル':'sliggoo-hisui','ヒスイヌメルゴン':'goodra-hisui','ヒスイクレベース':'avalugg-hisui','ヒスイジュナイパー':'decidueye-hisui',
    'パルデアケンタロス':'tauros-paldea-combat-breed','パルデアウパー':'wooper-paldea',
    'ヒートロトム':'rotom-heat','ウォッシュロトム':'rotom-wash','フロストロトム':'rotom-frost','スピンロトム':'rotom-fan','カットロトム':'rotom-mow','火ロトム':'rotom-heat','水ロトム':'rotom-wash','氷ロトム':'rotom-frost','飛行ロトム':'rotom-fan','草ロトム':'rotom-mow',
    'ギラティナオリジン':'giratina-origin','オリジンギラティナ':'giratina-origin','シェイミスカイ':'shaymin-sky','トルネロスれいじゅう':'tornadus-therian','ボルトロスれいじゅう':'thundurus-therian','ランドロスれいじゅう':'landorus-therian','ラブトロスれいじゅう':'enamorus-therian','ブラックキュレム':'kyurem-black','ホワイトキュレム':'kyurem-white','日食ネクロズマ':'necrozma-dusk','月食ネクロズマ':'necrozma-dawn','ウルトラネクロズマ':'necrozma-ultra','ザシアンけんのおう':'zacian-crowned','ザマゼンタたてのおう':'zamazenta-crowned','白バドレックス':'calyrex-ice','黒バドレックス':'calyrex-shadow','ガチグマアカツキ':'ursaluna-bloodmoon','イルカマンマイティ':'palafin-hero','テラパゴステラスタル':'terapagos-terastal','テラパゴスステラ':'terapagos-stellar',
    'イダイトウ♂':'basculegion-male','イダイトウ♀':'basculegion-female',
    'ヒスイイダイトウ♂':'basculegion-male','ヒスイイダイトウ♀':'basculegion-female',
    'イダイトウオス':'basculegion-male','イダイトウメス':'basculegion-female',
    'ヒスイイダイトウオス':'basculegion-male','ヒスイイダイトウメス':'basculegion-female'
  };
  const ITEM_SLUGS={
    "あおぞらプレート":"sky-plate",
    "あかいいと":"destiny-knot",
    "あくのジュエル":"dark-gem",
    "あついいわ":"heat-rock",
    "あつぞこブーツ":"heavy-duty-boots",
    "あやしいおこう":"odd-incense",
    "いかさまダイス":"loaded-dice",
    "いかずちプレート":"zap-plate",
    "いしずえのめん":"cornerstone-mask",
    "いどのめん":"wellspring-mask",
    "いのちのたま":"life-orb",
    "いわのジュエル":"rock-gem",
    "うしおのおこう":"sea-incense",
    "うすもものミツ":"pink-nectar",
    "おうじゃのしるし":"kings-rock",
    "おおきなねっこ":"big-root",
    "おはなのおこう":"rose-incense",
    "おまもりこばん":"amulet-coin",
    "おんみつマント":"covert-cloak",
    "かいがらのすず":"shell-bell",
    "かえんだま":"flame-orb",
    "かくとうジュエル":"fighting-gem",
    "かたいいし":"hard-stone",
    "かまどのめん":"hearthflame-mask",
    "からぶりほけん":"blunder-policy",
    "かるいし":"float-stone",
    "かわらずのいし":"everstone",
    "がくしゅうそうち":"exp-share",
    "がんせきおこう":"rock-incense",
    "がんせきプレート":"stone-plate",
    "きあいのタスキ":"focus-sash",
    "きあいのハチマキ":"focus-band",
    "きせきのタネ":"miracle-seed",
    "きゅうこん":"absorb-bulb",
    "きよめのおこう":"pure-incense",
    "きよめのおふだ":"cleanse-tag",
    "きれいなぬけがら":"shed-shell",
    "ぎんのこな":"silver-powder",
    "くさのジュエル":"grass-gem",
    "くちたけん":"rusted-sword",
    "くちたたて":"rusted-shield",
    "くっつきバリ":"sticky-barb",
    "くれないのミツ":"red-nectar",
    "くろいてっきゅう":"iron-ball",
    "くろいヘドロ":"black-sludge",
    "くろいメガネ":"black-glasses",
    "くろおび":"black-belt",
    "けむりだま":"smoke-ball",
    "こううんのおこう":"luck-incense",
    "こうかくレンズ":"wide-lens",
    "こうこうのしっぽ":"lagging-tail",
    "こうてつプレート":"iron-plate",
    "こおりのジュエル":"ice-gem",
    "こころのしずく":"soul-dew",
    "こだわりスカーフ":"choice-scarf",
    "こだわりハチマキ":"choice-band",
    "こだわりメガネ":"choice-specs",
    "こぶしのプレート":"fist-plate",
    "こわもてプレート":"dread-plate",
    "こんごうだま":"adamant-orb",
    "さざなみのおこう":"wave-incense",
    "さらさらいわ":"smooth-rock",
    "しあわせタマゴ":"lucky-egg",
    "しずくプレート":"splash-plate",
    "しめったいわ":"damp-rock",
    "しめつけバンド":"binding-band",
    "しらたま":"lustrous-orb",
    "しろいハーブ":"white-herb",
    "しんかいのウロコ":"deep-sea-scale",
    "しんかいのキバ":"deep-sea-tooth",
    "しんかのきせき":"eviolite",
    "しんぴのしずく":"mystic-water",
    "じしゃく":"magnet",
    "じめんのジュエル":"ground-gem",
    "じゃくてんほけん":"weakness-policy",
    "じゅうでんち":"cell-battery",
    "するどいくちばし":"sharp-beak",
    "するどいキバ":"razor-fang",
    "するどいツメ":"razor-claw",
    "せいれいプレート":"pixie-plate",
    "せんせいのツメ":"quick-claw",
    "たつじんのおび":"expert-belt",
    "たべのこし":"leftovers",
    "たまむしプレート":"insect-plate",
    "だいちのプレート":"earth-plate",
    "だっしゅつパック":"eject-pack",
    "だっしゅつボタン":"eject-button",
    "ちからのハチマキ":"muscle-band",
    "つめたいいわ":"icy-rock",
    "つららのプレート":"icicle-plate",
    "でんきだま":"light-ball",
    "でんきのジュエル":"electric-gem",
    "とくせいガード":"ability-shield",
    "とけないこおり":"never-melt-ice",
    "とつげきチョッキ":"assault-vest",
    "どくどくだま":"toxic-orb",
    "どくのジュエル":"poison-gem",
    "どくバリ":"poison-barb",
    "ながねぎ":"stick",
    "ねばりのかぎづめ":"grip-claw",
    "ねらいのまと":"ring-target",
    "のどスプレー":"throat-spray",
    "のろいのおふだ":"spell-tag",
    "のんきのおこう":"lax-incense",
    "はがねのジュエル":"steel-gem",
    "はっきんだま":"griseous-orb",
    "ばんのうがさ":"utility-umbrella",
    "ひかりごけ":"luminous-moss",
    "ひかりのこな":"bright-powder",
    "ひかりのねんど":"light-clay",
    "ひこうのジュエル":"flying-gem",
    "ひのたまプレート":"flame-plate",
    "ふうせん":"air-balloon",
    "ふしぎのプレート":"mind-plate",
    "ふといホネ":"thick-club",
    "ほのおのジュエル":"fire-gem",
    "ぼうごパット":"protective-pads",
    "ぼうじんゴーグル":"safety-goggles",
    "まがったスプーン":"twisted-spoon",
    "まっさらプレート":"blank-plate",
    "まんぷくおこう":"full-incense",
    "みずのジュエル":"water-gem",
    "みどりのプレート":"meadow-plate",
    "むしのジュエル":"bug-gem",
    "むらさきのミツ":"purple-nectar",
    "もうどくプレート":"toxic-plate",
    "もくたん":"charcoal",
    "ものしりメガネ":"wise-glasses",
    "もののけプレート":"spooky-plate",
    "ものまねハーブ":"mirror-herb",
    "やすらぎのすず":"soothe-bell",
    "やまぶきのミツ":"yellow-nectar",
    "やわらかいすな":"soft-sand",
    "ゆきだま":"snowball",
    "ようせいのハネ":"fairy-feather",
    "ようせいジュエル":"fairy-gem",
    "りゅうのキバ":"dragon-fang",
    "りゅうのプレート":"draco-plate",
    "アイスメモリ":"ice-memory",
    "アクアカセット":"douse-drive",
    "アブソルナイト":"absolite",
    "イナズマカセット":"shock-drive",
    "ウオーターメモリ":"water-memory",
    "エスパージュエル":"psychic-gem",
    "エルレイドナイト":"galladite",
    "エレキシード":"electric-seed",
    "エレクトロメモリ":"electric-memory",
    "オニゴーリナイト":"glalitite",
    "カイロスナイト":"pinsirite",
    "カメックスナイト":"blastoisinite",
    "ガブリアスナイト":"garchompite",
    "ガルーラナイト":"kangaskhanite",
    "ギャラドスナイト":"gyaradosite",
    "クチートナイト":"mawilite",
    "クリアチャーム":"clear-amulet",
    "グラウンドメモリ":"ground-memory",
    "グラスシード":"grassy-seed",
    "グラスメモリ":"grass-memory",
    "グランドコート":"terrain-extender",
    "ゲンガナイト":"gengarite",
    "ゴツゴツメット":"rocky-helmet",
    "ゴーストジュエル":"ghost-gem",
    "ゴーストメモリ":"ghost-memory",
    "サイキックメモリ":"psychic-memory",
    "サイコシード":"psychic-seed",
    "サメハダナイト":"sharpedonite",
    "サーナイトナイト":"gardevoirite",
    "シルクのスカーフ":"silk-scarf",
    "ジュカインナイト":"sceptilite",
    "ジュペッタナイト":"banettite",
    "スチールメモリ":"steel-memory",
    "スピアナイト":"beedrillite",
    "スピードパウダー":"quick-powder",
    "タブンネナイト":"audinite",
    "ダークメモリ":"dark-memory",
    "チャーレムナイト":"medichamite",
    "チルタリスナイト":"altarianite",
    "ディアンシナイト":"diancite",
    "デルダマ":"pass-orb",
    "デンリュウナイト":"ampharosite",
    "ドラゴンジュエル":"dragon-gem",
    "ドラゴンメモリ":"dragon-memory",
    "ノーマルジュエル":"normal-gem",
    "ハガネールナイト":"steelixite",
    "ハッサムナイト":"scizorite",
    "バクーダナイト":"cameruptite",
    "バグメモリ":"bug-memory",
    "バシャーモナイト":"blazikenite",
    "バンギラスナイト":"tyranitarite",
    "パワフルハーブ":"power-herb",
    "パンチグローブ":"punching-glove",
    "ビビリだま":"adrenaline-orb",
    "ピジョットナイト":"pidgeotite",
    "ピントレンズ":"scope-lens",
    "ファイトメモリ":"fighting-memory",
    "ファイヤーメモリ":"fire-memory",
    "フェアリーメモリ":"fairy-memory",
    "フォーカスレンズ":"zoom-lens",
    "フシギバナイト":"venusaurite",
    "フライングメモリ":"flying-memory",
    "フリーズカセット":"chill-drive",
    "フーディナイト":"alakazite",
    "ブレイズカセット":"burn-drive",
    "ブーストエナジー":"booster-energy",
    "プテラナイト":"aerodactylite",
    "ヘラクロスナイト":"heracronite",
    "ヘルガナイト":"houndoominite",
    "ボスゴドラナイト":"aggronite",
    "ボーマンダナイト":"salamencite",
    "ポイズンメモリ":"poison-memory",
    "ミストシード":"misty-seed",
    "ミミロップナイト":"lopunnite",
    "ミュウツナイトＸ":"mewtwonite-x",
    "ミュウツナイトＹ":"mewtwonite-y",
    "メタグロスナイト":"metagrossite",
    "メタルコート":"metal-coat",
    "メタルパウダー":"metal-powder",
    "メトロノーム":"metronome",
    "メンタルハーブ":"mental-herb",
    "ヤドランナイト":"slowbronite",
    "ヤミラミナイト":"sablenite",
    "ユキノオナイト":"abomasite",
    "ライボルトナイト":"manectite",
    "ラグラージナイト":"swampertite",
    "ラッキーパンチ":"lucky-punch",
    "ラティアスナイト":"latiasite",
    "ラティオスナイト":"latiosite",
    "リザードナイトＸ":"charizardite-x",
    "リザードナイトＹ":"charizardite-y",
    "ルカリオナイト":"lucarionite",
    "ルームサービス":"room-service",
    "レジェンドプレート":"legend-plate",
    "レッドカード":"red-card",
    "ロックメモリ":"rock-memory"
 ,
    "メガストーン":"key-stone",
    "きんのズリのみ":"golden-razz-berry",
    "きんのナナのみ":"golden-nanab-berry",
    "きんのパイルのみ":"golden-pinap-berry",
    "ぎんのズリのみ":"silver-razz-berry",
    "ぎんのナナのみ":"silver-nanab-berry",
    "ぎんのパイルのみ":"silver-pinap-berry",
    "アッキのみ":"kee-berry",
    "イアのみ":"iapapa-berry",
    "イトケのみ":"passho-berry",
    "イバンのみ":"custap-berry",
    "ウイのみ":"wiki-berry",
    "ウタンのみ":"payapa-berry",
    "ウブのみ":"grepa-berry",
    "オッカのみ":"occa-berry",
    "オボンのみ":"sitrus-berry",
    "オレンのみ":"oran-berry",
    "カイスのみ":"watmel-berry",
    "カゴのみ":"chesto-berry",
    "カシブのみ":"kasib-berry",
    "カムラのみ":"salac-berry",
    "キーのみ":"persim-berry",
    "クラボのみ":"cheri-berry",
    "ゴスのみ":"magost-berry",
    "サンのみ":"lansat-berry",
    "ザロクのみ":"pomeg-berry",
    "シュカのみ":"shuca-berry",
    "シーヤのみ":"pamtre-berry",
    "ジャポのみ":"jaboca-berry",
    "スターのみ":"starf-berry",
    "ズアのみ":"apicot-berry",
    "ズリのみ":"razz-berry",
    "セシナのみ":"wepear-berry",
    "ソクノのみ":"wacan-berry",
    "タポルのみ":"qualot-berry",
    "タラプのみ":"maranga-berry",
    "タンガのみ":"tanga-berry",
    "チイラのみ":"liechi-berry",
    "チーゴのみ":"rawst-berry",
    "ドリのみ":"durin-berry",
    "ナゾのみ":"enigma-berry",
    "ナナのみ":"nanab-berry",
    "ナナシのみ":"aspear-berry",
    "ナモのみ":"colbur-berry",
    "ネコブのみ":"kelpsy-berry",
    "ノメルのみ":"nomel-berry",
    "ノワキのみ":"spelon-berry",
    "ハバンのみ":"haban-berry",
    "バコウのみ":"coba-berry",
    "バンジのみ":"aguav-berry",
    "パイルのみ":"pinap-berry",
    "ヒメリのみ":"leppa-berry",
    "ビアーのみ":"kebia-berry",
    "フィラのみ":"figy-berry",
    "ブリーのみ":"bluk-berry",
    "ベリブのみ":"belue-berry",
    "ホズのみ":"chilan-berry",
    "マゴのみ":"mago-berry",
    "マトマのみ":"tamato-berry",
    "ミクルのみ":"micle-berry",
    "モコシのみ":"cornn-berry",
    "モモンのみ":"pecha-berry",
    "ヤタピのみ":"petaya-berry",
    "ヤチェのみ":"yache-berry",
    "ユキカブリのみ":"snover-berries",
    "ヨプのみ":"chople-berry",
    "ヨロギのみ":"charti-berry",
    "ラブタのみ":"rabuta-berry",
    "ラムのみ":"lum-berry",
    "リュガのみ":"ganlon-berry",
    "リリバのみ":"babiri-berry",
    "リンドのみ":"rindo-berry",
    "レンブのみ":"rowap-berry",
    "ロゼルのみ":"roseli-berry",
    "ロメのみ":"hondew-berry",
  };
  const ITEM_ALIASES={
    'たべのこし':['食べ残し','食べのこし','たべ残し','残飯'],
    'ようせいのハネ':['妖精の羽','妖精のはね','ようせいの羽','フェアリーフェザー','羽','はね','妖精'],
    'こだわりハチマキ':['拘り鉢巻','こだわり鉢巻','ハチマキ','鉢巻','はちまき'],
    'こだわりメガネ':['拘り眼鏡','こだわり眼鏡','メガネ','眼鏡'],
    'こだわりスカーフ':['拘りスカーフ','スカーフ'],
    'きあいのタスキ':['気合の襷','気合いの襷','タスキ','襷'],
    'いのちのたま':['命の珠','命珠','珠'],
    'とつげきチョッキ':['突撃チョッキ','チョッキ'],
    'ゴツゴツメット':['ゴツメ','ごつごつメット'],
    'ブーストエナジー':['ブエナ','エナジー'],
    'おんみつマント':['隠密マント','マント'],
    'クリアチャーム':['クリチャ','チャーム'],
    'オボンのみ':['オボン','オボンの実','おぼん','おぼんのみ','回復実','HP回復'],
    'ラムのみ':['ラム','ラムの実','らむ','らむのみ','状態異常回復'],
    'カゴのみ':['カゴ','カゴの実','かご','かごのみ','眠り回復'],
    'キーのみ':['キー','キーの実','きー','きーのみ','混乱回復'],
    'ヨプのみ':['ヨプ','ヨプの実','よぷのみ','よぷ','格闘半減','かくとう半減'],
    'メガストーン':['メガ石','メガいし','mega stone'],
    'のろいのおふだ':['呪いのお札','呪いのおふだ','おふだ','札','ゴースト強化'],
    'まがったスプーン':['曲がったスプーン','スプーン','エスパー強化'],
    'しめったいわ':['湿った岩','雨岩','あめいわ','雨ターン延長']
  };
  Object.keys(ITEM_SLUGS).filter(n=>n.endsWith('のみ')).forEach(name=>{
    const stem=name.slice(0,-2);
    ITEM_ALIASES[name]=[...(ITEM_ALIASES[name]||[]),stem,`${stem}の実`,`${stem}実`,`${stem}のみ`];
  });

  function kataToHira(str){return String(str||'').replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60))}
  function searchNorm(str){return kataToHira(String(str||'')).toLowerCase().replace(/[\s　・･_()（）\-ー]/g,'').replace(/[食喰]/g,'た').replace(/妖精/g,'ようせい').replace(/[羽翅]/g,'はね').replace(/鉢巻/g,'はちまき').replace(/眼鏡/g,'めがね').replace(/襷/g,'たすき').replace(/命/g,'いのち').replace(/珠/g,'たま')}
  function itemSearchText(name){return [name,...(ITEM_ALIASES[name]||[])].map(searchNorm).join('|')}
  function pokemonCandidates(query){const q=searchNorm(query);if(!q)return [];const names=[...Object.keys(window.POKEMON_JA_TO_ID||{}),...Object.keys(POKEMON_FORM_SLUGS)];return [...new Set(names)].filter(n=>searchNorm(n).includes(q)).sort((a,b)=>{const aa=searchNorm(a),bb=searchNorm(b);return Number(bb.startsWith(q))-Number(aa.startsWith(q))||a.length-b.length||a.localeCompare(b,'ja')}).slice(0,24)}
  function itemCandidates(query){const q=searchNorm(query);if(!q)return [];return Object.keys(ITEM_SLUGS).filter(n=>itemSearchText(n).includes(q)).sort((a,b)=>{const an=searchNorm(a),bn=searchNorm(b);const ar=an===q?0:an.startsWith(q)?1:itemSearchText(a).split('|').some(x=>x.startsWith(q))?2:3;const br=bn===q?0:bn.startsWith(q)?1:itemSearchText(b).split('|').some(x=>x.startsWith(q))?2:3;return ar-br||a.length-b.length||a.localeCompare(b,'ja')}).slice(0,60)}
  function moveCandidates(query){const q=searchNorm(query);if(!q)return [];return (window.POKEMON_MOVES_JA||[]).filter(n=>searchNorm(n).includes(q)).sort((a,b)=>Number(searchNorm(b).startsWith(q))-Number(searchNorm(a).startsWith(q))||a.length-b.length||a.localeCompare(b,'ja')).slice(0,30)}
  function isMegaPokemon(name){return /^メガ/.test(normalizePokemonName(name))}
  function ensureSuggestionHost(input){let wrap=input.parentElement;if(!wrap.classList.contains('autocomplete-host')){const host=document.createElement('div');host.className='autocomplete-host';input.parentNode.insertBefore(host,input);host.appendChild(input);wrap=host}let box=wrap.querySelector(':scope > .autocomplete-list');if(!box){box=document.createElement('div');box.className='autocomplete-list';wrap.appendChild(box)}return box}
  function attachAutocomplete(input,type,onPick){if(!input||input.dataset.autocompleteBound)return;input.dataset.autocompleteBound='1';const box=ensureSuggestionHost(input);const render=()=>{const vals=type==='pokemon'?pokemonCandidates(input.value):type==='item'?itemCandidates(input.value):moveCandidates(input.value);box.innerHTML=vals.map(v=>`<button type="button" class="autocomplete-option">${esc(v)}</button>`).join('');box.classList.toggle('show',vals.length>0);box.querySelectorAll('button').forEach((b,i)=>b.onmousedown=e=>{e.preventDefault();input.value=vals[i];box.classList.remove('show');input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));if(onPick)onPick(vals[i])})};input.addEventListener('input',render);input.addEventListener('focus',render);input.addEventListener('blur',()=>setTimeout(()=>box.classList.remove('show'),140));input.addEventListener('keydown',e=>{if(e.key==='Escape')box.classList.remove('show')})}
  const NATURES={
    'がんばりや':{},'さみしがり':{up:'A',down:'B'},'ゆうかん':{up:'A',down:'S'},'いじっぱり':{up:'A',down:'C'},'やんちゃ':{up:'A',down:'D'},
    'ずぶとい':{up:'B',down:'A'},'すなお':{},'のんき':{up:'B',down:'S'},'わんぱく':{up:'B',down:'C'},'のうてんき':{up:'B',down:'D'},
    'おくびょう':{up:'S',down:'A'},'せっかち':{up:'S',down:'B'},'まじめ':{},'ようき':{up:'S',down:'C'},'むじゃき':{up:'S',down:'D'},
    'ひかえめ':{up:'C',down:'A'},'おっとり':{up:'C',down:'B'},'れいせい':{up:'C',down:'S'},'てれや':{},'うっかりや':{up:'C',down:'D'},
    'おだやか':{up:'D',down:'A'},'おとなしい':{up:'D',down:'B'},'なまいき':{up:'D',down:'S'},'しんちょう':{up:'D',down:'C'},'きまぐれ':{}
  };
  const apiCache=new Map(), itemCache=new Map(), abilityCache=new Map();

  const $=s=>document.querySelector(s), uid=()=>crypto.randomUUID?.()||Date.now()+Math.random().toString(16).slice(2);
  let db, saveTimer, dragId=null, tagTargetId=null;

  function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>{db=r.result;resolve()};r.onerror=()=>reject(r.error)})}
  function dbGet(key){return new Promise((resolve,reject)=>{const r=db.transaction(STORE).objectStore(STORE).get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
  function dbSet(key,val){return new Promise((resolve,reject)=>{const r=db.transaction(STORE,'readwrite').objectStore(STORE).put(val,key);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
  function payload(){return {teams:state.teams,seasons:state.seasons,currentSeason:state.currentSeason,teamScope:state.teamScope,updatedAt:new Date().toISOString()}}
  function scheduleSave(){clearTimeout(saveTimer);saveTimer=setTimeout(async()=>{await dbSet('data',payload());setSyncText(cloud.user?'端末に保存・クラウド同期中':'この端末に保存');if(cloud.user)scheduleCloudSave();else toast('保存しました')},350)}
  function setSyncText(text){const el=$('#syncState');if(el)el.textContent=text}
  function scheduleCloudSave(){clearTimeout(cloudSaveTimer);cloudSaveTimer=setTimeout(saveCloud,800)}
  async function saveCloud(){if(!cloud.user||!cloud.db||cloud.saving)return;cloud.saving=true;setSyncText('クラウド同期中…');try{const {doc,setDoc,serverTimestamp}=cloud.api;await setDoc(doc(cloud.db,'users',cloud.user.uid,'apps','pokemon-team-manager'),{...payload(),updatedAt:serverTimestamp()},{merge:false});setSyncText('クラウド同期済み');toast('クラウドに保存しました')}catch(e){console.error(e);setSyncText('同期エラー');toast('クラウド同期に失敗しました')}finally{cloud.saving=false}}
  function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._tm);t._tm=setTimeout(()=>t.classList.remove('show'),1200)}
  const blankAdjustment=()=>({pokemon:'',nature:'',ability:'',item:'',tera:'',moves:'',moveSlots:['','','',''],moveAlternatives:['','','',''],pokemonCandidate:'',pokemonCandidateMemo:'',iv:{H:31,A:31,B:31,C:31,D:31,S:31},ev:{H:0,A:0,B:0,C:0,D:0,S:0},memo:''});
  const blankTeam=()=>({id:uid(),user:'',owner:state.teamScope==='my'?'self':'other',rank:'',season:state.currentSeason==='all'?(state.seasons[0]||'未分類'):state.currentSeason,regulation:'',title:'',oneLine:'',tag:'none',updatedAt:new Date().toISOString(),pokemon:Array(6).fill(''),items:Array(6).fill(''),abilities:Array(6).fill(''),natures:Array(6).fill(''),pokemonChanges:[],moveChanges:[],adjustments:Array.from({length:6},blankAdjustment),favorableMatchups:[],unfavorableMatchups:[],overallMemo:{lead:'',weak:'',improve:'',battle:'',free:''}});
  function normalizePokemonName(name){return String(name||'').trim().replace(/\s+/g,'').replace(/[・･]/g,'').replace(/（/g,'(').replace(/）/g,')').replace(/[Ｘｘ]/g,'X').replace(/[Ｙｙ]/g,'Y')}
  function pokemonApiKey(name){
    const raw=normalizePokemonName(name);if(!raw)return null;
    const formKey=raw.replace(/[()]/g,'');
    if(POKEMON_FORM_SLUGS[raw])return POKEMON_FORM_SLUGS[raw];
    if(POKEMON_FORM_SLUGS[formKey])return POKEMON_FORM_SLUGS[formKey];
    const dict=window.POKEMON_JA_TO_ID||{};
    if(dict[raw])return dict[raw];
    const base=raw.replace(/\(.+?\)$/,'');
    return dict[base]||null;
  }
  function imgFor(name){return placeholder(name)}
  async function pokemonData(name){
    const key=pokemonApiKey(name);if(!key)return null;
    if(apiCache.has(String(key)))return apiCache.get(String(key));
    try{const r=await fetch(`https://pokeapi.co/api/v2/pokemon/${key}`);if(!r.ok)throw Error(r.status);const d=await r.json();apiCache.set(String(key),d);return d}catch(e){console.warn('pokemon fetch failed',name,key,e);return null}
  }
  async function hydrateImages(root=document){
    const imgs=[...root.querySelectorAll('img[data-pokemon]')];
    await Promise.all(imgs.map(async img=>{const name=(img.dataset.pokemon||'').trim();img.src=placeholder(name);const d=await pokemonData(name);const src=d?.sprites?.other?.['official-artwork']?.front_default||d?.sprites?.front_default;if(src)img.src=src}));
    const items=[...root.querySelectorAll('img[data-item]')];
    await Promise.all(items.map(async img=>{const name=(img.dataset.item||'').trim();img.src=transparentPixel();const src=await itemImage(name);if(src)img.src=src}));
  }
  function itemSlug(name){const raw=String(name||'').trim();if(!raw)return null;return ITEM_SLUGS[raw]||raw.toLowerCase().replace(/\s+/g,'-')}
  async function itemImage(name){const slug=itemSlug(name);if(!slug)return null;if(slug==='fairy-feather')return './item-fairy-feather.png';if(itemCache.has(slug))return itemCache.get(slug);const direct=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${slug}.png`;itemCache.set(slug,direct);return direct}
  async function abilityNamesForPokemon(name){
    const key=normalizePokemonName(name);if(!key)return [];
    if(abilityCache.has(key))return abilityCache.get(key);
    const d=await pokemonData(name);if(!d)return [];
    const names=[];
    await Promise.all((d.abilities||[]).map(async a=>{try{const r=await fetch(a.ability.url);if(!r.ok)throw Error(r.status);const ad=await r.json();const ja=(ad.names||[]).find(x=>x.language.name==='ja-Hrkt')||(ad.names||[]).find(x=>x.language.name==='ja');names.push(ja?.name||a.ability.name)}catch{names.push(a.ability.name)}}));
    const out=[...new Set(names)];abilityCache.set(key,out);return out;
  }
  function attachAbilityAutocomplete(input,getPokemonName){if(!input||input.dataset.autocompleteBound)return;input.dataset.autocompleteBound='1';const box=ensureSuggestionHost(input);let token=0;const render=async()=>{const my=++token,q=searchNorm(input.value),all=await abilityNamesForPokemon(getPokemonName());if(my!==token)return;const vals=all.filter(n=>!q||searchNorm(n).includes(q)).sort((a,b)=>Number(searchNorm(b).startsWith(q))-Number(searchNorm(a).startsWith(q))||a.localeCompare(b,'ja'));box.innerHTML=vals.map(v=>`<button type="button" class="autocomplete-option">${esc(v)}</button>`).join('');box.classList.toggle('show',vals.length>0);box.querySelectorAll('button').forEach((b,i)=>b.onmousedown=e=>{e.preventDefault();input.value=vals[i];box.classList.remove('show');input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}))})};input.addEventListener('input',render);input.addEventListener('focus',render);input.addEventListener('blur',()=>setTimeout(()=>box.classList.remove('show'),140));}
  function statSummary(vals){return ['H','A','B','C','D','S'].map(k=>`${k}${vals?.[k]??'－'}`).join(', ')}
  function transparentPixel(){return 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}
  function placeholder(name){const txt=(name||'?').slice(0,4);return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" rx="18" fill="#eef1f6"/><circle cx="80" cy="65" r="34" fill="#d6dbe5"/><text x="80" y="126" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#677085">${txt}</text></svg>`)}`}
  function esc(v=''){return String(v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
  function setTeam(id,patch){const t=state.teams.find(x=>x.id===id);if(!t)return;Object.assign(t,patch,{updatedAt:new Date().toISOString()});scheduleSave()}


  function renderSeasons(){const sel=$('#seasonSelect');if(!sel)return;sel.innerHTML=`<option value="all">すべてのシーズン</option>`+state.seasons.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');if(!['all',...state.seasons].includes(state.currentSeason))state.currentSeason='all';sel.value=state.currentSeason;sel.onchange=()=>{state.currentSeason=sel.value;scheduleSave();renderList();closeSettingsMenu()}}
  function addSeason(){const box=$('#newSeasonInput');const n=(box?.value||'').trim();if(!n){alert('追加するシーズン名を入力してください。例：S36');box?.focus();return}if(state.seasons.includes(n)){alert('同じシーズン名があります。');return}state.seasons.push(n);state.currentSeason=n;if(box)box.value='';scheduleSave();renderSeasons();renderList();toast(`「${n}」を追加しました`)}
  function renameSeason(){if(state.currentSeason==='all'){alert('名称変更するシーズンを選択してください。');return}const old=state.currentSeason;const name=prompt('新しいシーズン名',old);if(!name||!name.trim()||name.trim()===old)return;const n=name.trim();if(state.seasons.includes(n)){alert('同じシーズン名があります。');return}state.seasons=state.seasons.map(x=>x===old?n:x);state.teams.forEach(t=>{if((t.season||'未分類')===old)t.season=n});state.currentSeason=n;scheduleSave();renderSeasons();renderList()}
  function deleteSeason(){if(state.currentSeason==='all'){alert('削除するシーズンを選択してください。');return}const old=state.currentSeason;if(!confirm(`「${old}」を削除しますか？構築は「未分類」へ移動します。`))return;if(!state.seasons.includes('未分類'))state.seasons.unshift('未分類');state.teams.forEach(t=>{if((t.season||'未分類')===old)t.season='未分類'});state.seasons=state.seasons.filter(x=>x!==old);state.currentSeason='all';scheduleSave();renderSeasons();renderList()}

  function renderTeamScopeTabs(){document.querySelectorAll('[data-team-scope]').forEach(b=>{b.classList.toggle('active',b.dataset.teamScope===state.teamScope);b.onclick=()=>{state.teamScope=b.dataset.teamScope;scheduleSave();renderTeamScopeTabs();renderList();closeSettingsMenu()}})}

  function renderFilters(){const defs=[['all','すべて'],['red','🔴 注目'],['blue','🔵 試用'],['green','🟢 上位'],['purple','🟣 要研究']];$('#filters').innerHTML=defs.map(([k,l])=>`<button class="btn small filter ${state.filter===k?'active':''}" data-filter="${k}">${l}</button>`).join('');document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;renderList();renderFilters()})}
  function filtered(){const q=state.query.trim().toLowerCase();return state.teams.filter(t=>((state.teamScope==='my'?(t.owner==='self'):(t.owner!=='self')))&&(state.currentSeason==='all'||(t.season||'未分類')===state.currentSeason)&&(state.filter==='all'||t.tag===state.filter)&&(!q||[t.user,t.rank,t.title,t.season,t.regulation,...t.pokemon].join(' ').toLowerCase().includes(q)))}
  function renderList(){const list=filtered();const scoped=state.teams.filter(t=>(state.teamScope==='my'?t.owner==='self':t.owner!=='self')&&(state.currentSeason==='all'||(t.season||'未分類')===state.currentSeason));$('#counts').textContent=`${state.teamScope==='my'?'My Team':'World Team'} ／ ${state.currentSeason==='all'?'全シーズン':state.currentSeason}：全${scoped.length}件 ／ 表示${list.length}件　${Object.entries(TAGS).slice(1).map(([k,v])=>`${v.emoji}${state.teams.filter(t=>t.tag===k).length}`).join(' ')}`;$('#teamList').innerHTML=list.length?list.map(teamRowHTML).join(''):'<div class="empty">構築がありません。「＋新規」から追加してください。</div>';hydrateImages($('#teamList'));bindRows()}
  function teamRowHTML(t){return `<article class="team-row" data-id="${t.id}" data-tag="${t.tag}">
    <div class="team-meta">
      <div class="field"><label>使用者</label><input data-k="user" value="${esc(t.user)}" placeholder="使用者"></div>
      <div class="field"><label>順位</label><input data-k="rank" value="${esc(t.rank)}" placeholder="最終○位"></div>
    </div>
    <div class="party">${t.pokemon.map((n,i)=>`<div class="mon"><div class="mon-image-wrap"><img data-pokemon="${esc(n)}" src="${imgFor(n)}"><img class="held-item-icon" data-item="${esc((t.items||[])[i]||'')}" alt=""></div><div class="mon-name">${esc(n||'未登録')}</div></div>`).join('')}</div>
    <div class="row-actions"><button class="btn small detail-btn" title="詳細を開く">詳細</button><button class="tag-btn" title="タグ">${TAGS[t.tag||'none'].emoji}</button><button class="btn drag-handle" title="長押しして並べ替え">≡</button></div>
  </article>`}
  function bindRows(){document.querySelectorAll('.team-row').forEach(row=>{const id=row.dataset.id;row.querySelectorAll('[data-k]').forEach(inp=>inp.oninput=()=>setTeam(id,{[inp.dataset.k]:inp.value}));row.querySelector('.detail-btn').onclick=()=>openDetail(id);row.querySelector('.tag-btn').onclick=()=>openTag(id);const h=row.querySelector('.drag-handle');h.onpointerdown=e=>startDrag(e,id,row);});}
  function startDrag(e,id,row){e.preventDefault();dragId=id;row.classList.add('dragging');row.setPointerCapture(e.pointerId);const move=ev=>{const el=document.elementFromPoint(ev.clientX,ev.clientY)?.closest('.team-row');if(!el||el===row)return;const from=state.teams.findIndex(t=>t.id===dragId),to=state.teams.findIndex(t=>t.id===el.dataset.id);if(from<0||to<0)return;const [item]=state.teams.splice(from,1);state.teams.splice(to,0,item);renderList();const newRow=document.querySelector(`.team-row[data-id="${dragId}"]`);newRow?.classList.add('dragging')};const up=()=>{dragId=null;document.querySelectorAll('.team-row').forEach(r=>r.classList.remove('dragging'));scheduleSave();document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',up)};document.addEventListener('pointermove',move);document.addEventListener('pointerup',up,{once:true})}
  function openTag(id){tagTargetId=id;$('#tagOptions').innerHTML=Object.entries(TAGS).map(([k,v])=>`<button class="tag-option" data-tag-choice="${k}"><span class="dot" style="background:${v.color}"></span><strong>${v.emoji} ${v.label}</strong></button>`).join('');document.querySelectorAll('[data-tag-choice]').forEach(b=>b.onclick=()=>{setTeam(tagTargetId,{tag:b.dataset.tagChoice});$('#tagModal').classList.remove('show');renderList()});$('#tagModal').classList.add('show')}

  function openDetail(id,returnContext=null){state.currentId=id;state.detailReturn=returnContext;$('#listView').classList.remove('active');$('#pokemonView').classList.remove('active');$('#detailView').classList.add('active');$('#backBtn').textContent=returnContext?.type==='pokemon'?`← ${returnContext.name}の一覧`:'← 一覧';renderDetail();scrollTo(0,0)}
  function current(){return state.teams.find(t=>t.id===state.currentId)}
  function ensureTeamAdjustments(t){t.items=Array.from({length:6},(_,i)=>(t.items||[])[i]||'');t.abilities=Array.from({length:6},(_,i)=>(t.abilities||[])[i]||'');t.natures=Array.from({length:6},(_,i)=>(t.natures||[])[i]||'');t.adjustments=Array.from({length:6},(_,i)=>{const a=(t.adjustments||[])[i]||blankAdjustment();a.pokemon=t.pokemon[i]||'';a.item=t.items[i]||'';a.ability=t.abilities[i]||'';a.nature=t.natures[i]||'';a.iv={H:31,A:31,B:31,C:31,D:31,S:31,...(a.iv||{})};a.ev={H:0,A:0,B:0,C:0,D:0,S:0,...(a.ev||{})};for(const k of ['H','A','B','C','D','S'])a.ev[k]=legacyEVToPoint(a.ev[k]);a.ev=sanitizeEffortObject(a.ev);a.moveSlots=Array.from({length:4},(_,j)=>(a.moveSlots||splitMoves(a.moves))[j]||'');a.moveAlternatives=Array.from({length:4},(_,j)=>(a.moveAlternatives||[])[j]||'');if(!a.pokemonCandidate){const pc=(t.pokemonChanges||[]).find(x=>normalizePokemonName(x.from)===normalizePokemonName(a.pokemon));if(pc){a.pokemonCandidate=pc.to||'';a.pokemonCandidateMemo=pc.reason||''}}for(const mc of (t.moveChanges||[]).filter(x=>normalizePokemonName(x.pokemon)===normalizePokemonName(a.pokemon))){const j=a.moveSlots.findIndex(x=>normalizePokemonName(x)===normalizePokemonName(mc.fromMove));if(j>=0&&!a.moveAlternatives[j])a.moveAlternatives[j]=mc.toMove||''}return a})}
  function renderDetail(){const t=current();if(!t)return;ensureTeamAdjustments(t);$('#detailTitle').textContent=t.title||'構築詳細';$('#detailContent').innerHTML=`
    <div class="section"><h3>基本情報</h3><div class="detail-grid">
      <div class="quick-input"><div class="field"><label>基本情報まとめ入力</label><input id="basicQuickInput" placeholder="使用者 / 順位 / ポケモン1 / ポケモン2 / …"></div><small>最初の2項目を使用者・順位、それ以降をパーティへ反映します。</small></div>
      ${field('使用者','user',t.user)}${ownerField(t.owner)}${field('順位','rank',t.rank)}${seasonField(t.season)}
      ${field('構築名','title',t.title)}${field('一言メモ','oneLine',t.oneLine)}
    </div></div>
    <div class="section"><h3>パーティ</h3><div class="quick-input" style="margin-bottom:10px"><div class="field"><label>6体まとめて入力</label><input id="partyQuickInput" value="${esc(t.pokemon.filter(Boolean).join(' / '))}" placeholder="カイリュー / サーフゴー / …　または　カイリュー、サーフゴー、…"></div><small>「/」または「、」で区切ると6枠へ自動反映します。</small></div><div class="editor-party">${t.pokemon.map((n,i)=>editorMon(t,i)).join('')}</div></div>
    <div class="section party-memo-section"><h3>構築メモ</h3><div class="detail-grid">
      ${area('基本選出','lead',t.overallMemo.lead)}${area('苦手な相手','weak',t.overallMemo.weak)}${area('改善点','improve',t.overallMemo.improve)}${area('対戦メモ','battle',t.overallMemo.battle)}${area('自由メモ','free',t.overallMemo.free)}
    </div></div>
    <div class="section"><h3>ポケモンごとの調整・変更候補</h3><p class="sub">上の6体と自動連動します。個体値・努力値・技・調整意図を入力してください。</p><div class="cards">${t.adjustments.map((x,i)=>adjustmentCard(x,i)).join('')}</div></div>
    ${cardsSection('有利な構築','favorableMatchups',t.favorableMatchups,matchupCard,'＋有利な構築を追加')}
    ${cardsSection('不利な構築','unfavorableMatchups',t.unfavorableMatchups,matchupCard,'＋不利な構築を追加')}
    `;
    bindDetail();
  }
  function field(label,key,val){return `<div class="field"><label>${label}</label><input data-basic="${key}" value="${esc(val)}"></div>`}
  function ownerField(val){return `<div class="field"><label>登録区分</label><select data-basic="owner"><option value="other" ${val!=='self'?'selected':''}>自分以外（World Team）</option><option value="self" ${val==='self'?'selected':''}>自分（My Team）</option></select></div>`}
  function seasonField(val){return `<div class="field"><label>シーズン</label><select data-basic="season">${state.seasons.map(x=>`<option ${x===val?'selected':''}>${esc(x)}</option>`).join('')}</select></div>`}
  function splitInput(v){return String(v||'').split(/\s*(?:\/|、)\s*/).map(x=>x.trim()).filter(Boolean)}
  function area(label,key,val){return `<div class="field"><label>${label}</label><textarea data-overall="${key}">${esc(val)}</textarea></div>`}
  function editorMon(t,i){const name=t.pokemon[i]||'',item=t.items[i]||'',ability=t.abilities[i]||'',nature=t.natures[i]||'';return `<div class="editor-mon" data-party-card="${i}"><div class="editor-image-wrap"><img data-pokemon="${esc(name)}" src="${imgFor(name)}"><img class="held-item-icon large" data-item="${esc(item)}" alt=""></div><input data-poke-index="${i}" value="${esc(name)}" placeholder="ポケモン名"><input data-item-index="${i}" value="${esc(item)}" placeholder="持ち物"><input data-ability-index="${i}" value="${esc(ability)}" placeholder="特性"><select class="nature-select ${natureClass(nature)}" data-nature-index="${i}">${natureOptions(nature)}</select><div class="party-stat-summary" data-party-stat="${i}">調整後：H－, A－, B－, C－, D－, S－</div><div class="party-effort-summary" data-party-effort="${i}">振り方：H0, A0, B0, C0, D0, S0</div></div>`}
  function cardsSection(title,key,items,renderer,button){return `<div class="section"><h3>${title}</h3><div class="cards">${items.map((x,i)=>renderer(x,i)).join('')}</div><button class="btn primary" data-add-card="${key}" style="margin-top:10px">${button}</button></div>`}
  function pokemonChangeCard(x,i){return `<div class="memo-card" data-card="pokemonChanges" data-index="${i}"><div class="card-grid">
    <div class="field"><label>現在のポケモン</label><input data-c="from" value="${esc(x.from||'')}"><div class="preview"><img data-preview="from" data-pokemon="${esc(x.from||'')}" src="${imgFor(x.from)}"></div></div><div class="arrow">→</div>
    <div class="field"><label>変更候補</label><input data-c="to" value="${esc(x.to||'')}"><div class="preview"><img data-preview="to" data-pokemon="${esc(x.to||'')}" src="${imgFor(x.to)}"></div></div></div>
    <div class="field"><label>理由・使用感</label><textarea data-c="reason">${esc(x.reason||'')}</textarea></div><div class="status-row"><select data-c="status"><option>未検証</option><option>試用中</option><option>採用</option><option>不採用</option></select><button class="btn danger delete-card">削除</button></div></div>`}
  function moveChangeCard(x,i){return `<div class="memo-card" data-card="moveChanges" data-index="${i}"><div class="card-grid">
    <div class="field"><label>ポケモン</label><input data-c="pokemon" value="${esc(x.pokemon||'')}"><div class="preview"><img data-preview="pokemon" data-pokemon="${esc(x.pokemon||'')}" src="${imgFor(x.pokemon)}"></div></div><div class="arrow">→</div>
    <div><div class="field"><label>現在の技</label><input data-c="fromMove" value="${esc(x.fromMove||'')}"></div><div class="field"><label>代替技候補</label><input data-c="toMove" value="${esc(x.toMove||'')}"></div></div></div>
    <div class="field"><label>理由・使用感</label><textarea data-c="reason">${esc(x.reason||'')}</textarea></div><div class="status-row"><select data-c="status"><option>未検証</option><option>試用中</option><option>採用</option><option>不採用</option></select><button class="btn danger delete-card">削除</button></div></div>`}
  function natureLabel(n){const x=NATURES[n]||{};return x.up&&x.down?`${n}（${x.up}↑${x.down}↓）`:`${n}（補正なし）`}
  function natureColor(n){const u=(NATURES[n]||{}).up;return {A:'#e53935',B:'#1976d2',C:'#d39b00',D:'#2e8b57',S:'#8e24aa'}[u]||'#64748b'}
  function natureClass(n){const u=(NATURES[n]||{}).up;return u?'nature-'+u.toLowerCase():'nature-neutral'}
  function natureOptions(current){
    const order=['A','B','C','D','S'];
    const labels={A:'A↑（こうげき上昇）',B:'B↑（ぼうぎょ上昇）',C:'C↑（とくこう上昇）',D:'D↑（とくぼう上昇）',S:'S↑（すばやさ上昇）'};
    const groups=order.map(stat=>{
      const list=Object.keys(NATURES).filter(n=>NATURES[n].up===stat);
      return `<optgroup label="${labels[stat]}">${list.map(n=>`<option style="color:${natureColor(n)};font-weight:700" value="${n}" ${n===current?'selected':''}>${natureLabel(n)}</option>`).join('')}</optgroup>`;
    }).join('');
    const neutral=Object.keys(NATURES).filter(n=>!NATURES[n].up);
    return `<option value="">性格を選択</option>`+groups+`<optgroup label="無補正">${neutral.map(n=>`<option style="color:#64748b" value="${n}" ${n===current?'selected':''}>${natureLabel(n)}</option>`).join('')}</optgroup>`;
  }
  function effortTotal(ev){return ['H','A','B','C','D','S'].reduce((sum,k)=>sum+clampNum(ev?.[k]??0,0,32),0)}
  function effortRemaining(ev){return Math.max(0,64-effortTotal(ev))}
  function sanitizeEffortObject(ev){const out={H:0,A:0,B:0,C:0,D:0,S:0};let left=64;for(const k of ['H','A','B','C','D','S']){const v=Math.min(32,left,clampNum(ev?.[k]??0,0,32));out[k]=v;left-=v}return out}

  function adjustmentCard(x,i){const ev=x.ev||{},iv=x.iv||{},remaining=effortRemaining(ev);return `<details class="memo-card adjustment-card" data-card="adjustments" data-index="${i}" open><summary class="adjustment-summary"><div class="adjustment-identity"><div class="editor-image-wrap compact-mon"><img data-pokemon="${esc(x.pokemon||'')}" src="${imgFor(x.pokemon)}"><img class="held-item-icon large" data-item="${esc(x.item||'')}" alt=""></div><div><strong>${i+1}体目：${esc(x.pokemon||'未登録')}</strong><div class="sub">${esc(x.item||'持ち物未登録')} / ${esc(x.ability||'特性未登録')} / ${esc(natureLabel(x.nature||''))}</div></div></div><div class="effort-remaining" data-ev-remaining>残り ${remaining}</div></summary><div class="adjustment-body"><div class="adjust-grid">
    <div class="field"><label>ポケモン</label><input data-c="pokemon" value="${esc(x.pokemon||'')}" disabled></div><div class="field"><label>性格</label><select class="nature-select ${natureClass(x.nature||'')}" data-c="nature">${natureOptions(x.nature||'')}</select></div><div class="field"><label>特性</label><input data-c="ability" value="${esc(x.ability||'')}" placeholder="特性"></div><div class="field"><label>持ち物</label><input data-c="item" value="${esc(x.item||'')}" placeholder="持ち物"></div><div class="field"><label>テラスタイプ</label><input data-c="tera" value="${esc(x.tera||'')}"></div><div class="field"><label>変更候補ポケモン</label><input data-c="pokemonCandidate" value="${esc(x.pokemonCandidate||'')}" placeholder="候補ポケモン"></div></div>
    <div class="field"><label>ポケモン変更候補の理由・使用感</label><textarea data-c="pokemonCandidateMemo">${esc(x.pokemonCandidateMemo||'')}</textarea></div>
    <div class="move-slots"><strong>技構成・代替候補</strong>${[0,1,2,3].map(j=>`<div class="move-slot-row"><div class="field"><label>技${j+1}</label><input data-move-slot="${j}" value="${esc((x.moveSlots||[])[j]||'')}" placeholder="技${j+1}"></div><div class="move-arrow">→</div><div class="field"><label>代替候補</label><input data-move-alt="${j}" value="${esc((x.moveAlternatives||[])[j]||'')}" placeholder="変更候補"></div></div>`).join('')}</div>
    <div class="stat-entry"><strong>Lv50実数値計算</strong><small>個体値は0〜31。努力値ポイントは各能力0〜32、6能力の合計は最大64です。性格補正は上昇1.1倍・下降0.9倍です。</small>
      <div class="stat-table stat-head"><span></span>${['H','A','B','C','D','S'].map(k=>`<b>${k}</b>`).join('')}</div>
      <div class="stat-table"><span>個体値</span>${['H','A','B','C','D','S'].map(k=>`<input type="number" min="0" max="31" data-iv="${k}" value="${esc(iv[k]??31)}">`).join('')}</div>
      <div class="stat-table"><span>努力値</span>${['H','A','B','C','D','S'].map(k=>`<input type="number" min="0" max="32" step="1" data-ev="${k}" value="${esc(ev[k]??0)}">`).join('')}</div>
      <div class="stat-table calculated"><span>実数値</span>${['H','A','B','C','D','S'].map(k=>`<output data-stat-output="${k}">－</output>`).join('')}</div>
      <div class="stat-note" data-stat-note>種族値を取得して計算します。</div>
    </div><div class="field"><label>調整意図・使用感</label><textarea data-c="memo">${esc(x.memo||'')}</textarea></div></div></details>`}
  function matchupCard(x,i){const key=x._key||'';const mons=Array.isArray(x.pokemon)?x.pokemon:Array(6).fill('');const cls=key==='favorableMatchups'?'advantage':'disadvantage';const linked=state.teams.find(t=>t.id===x.linkedTeamId);return `<div class="memo-card ${cls}" data-card="${key}" data-index="${i}">
    <div class="matchup-search"><div class="field"><label>登録済み構築から検索して選択</label><input data-match-search placeholder="使用者・順位・構築名・ポケモン名で検索"><div class="matchup-results"></div></div></div>
    <div class="linked-note">${linked?`リンク元：${esc(linked.user||'使用者未登録')} / ${esc(linked.rank||'順位未登録')} / ${esc(linked.title||'構築名未登録')}`:'既存構築を選ばず、下の欄へ1〜6体だけ直接入力することもできます。'}</div>
    <div class="matchup-head"><div class="field"><label>相手構築名・軸</label><input data-c="title" value="${esc(x.title||'')}" placeholder="例：受けループ／雨パ"></div><div class="field"><label>使用者・順位・出典</label><input data-c="source" value="${esc(x.source||'')}" placeholder="例：○○ / 最終50位"></div></div>
    <div class="matchup-party">${mons.map((n,j)=>`<div class="matchup-mon"><img data-match-preview="${j}" data-pokemon="${esc(n)}" src="${imgFor(n)}"><input data-match-poke="${j}" value="${esc(n)}" placeholder="ポケモン名"></div>`).join('')}</div>
    <div class="field"><label>${key==='favorableMatchups'?'有利な理由・基本の勝ち筋':'不利な理由・注意点'}</label><textarea data-c="reason">${esc(x.reason||'')}</textarea></div><div class="field"><label>選出・立ち回りメモ</label><textarea data-c="plan">${esc(x.plan||'')}</textarea></div><div class="status-row"><button class="btn small" data-clear-link>既存構築とのリンクを解除</button><button class="btn danger delete-card">削除</button></div></div>`}
  function matchupSearchResults(query){const q=(query||'').trim().toLowerCase();if(!q)return [];return state.teams.filter(t=>t.id!==state.currentId&&[t.user,t.rank,t.title,t.season,t.regulation,...(t.pokemon||[])].join(' ').toLowerCase().includes(q)).slice(0,12)}
  function applyTeamToMatchup(item,team){item.linkedTeamId=team.id;item.title=team.title||'';item.source=[team.user,team.rank].filter(Boolean).join(' / ');item.pokemon=Array.from({length:6},(_,i)=>(team.pokemon||[])[i]||'');item.sourceSeason=team.season||''}


  function bindDetail(){const t=current();hydrateImages($('#detailContent'));const bq=$('#basicQuickInput');if(bq)bq.onchange=()=>{const a=splitInput(bq.value);if(a[0]!=null)t.user=a[0];if(a[1]!=null)t.rank=a[1];const mons=a.slice(2,8);if(mons.length){t.pokemon=Array.from({length:6},(_,i)=>mons[i]||t.pokemon?.[i]||'');ensureTeamAdjustments(t)}t.updatedAt=new Date().toISOString();scheduleSave();renderDetail()};const pq=$('#partyQuickInput');if(pq)pq.onchange=()=>{const a=splitInput(pq.value).slice(0,6);t.pokemon=Array.from({length:6},(_,i)=>a[i]||'');t.updatedAt=new Date().toISOString();scheduleSave();renderDetail()};document.querySelectorAll('[data-basic]').forEach(el=>el.oninput=()=>{setTeam(t.id,{[el.dataset.basic]:el.value});if(el.dataset.basic==='title')$('#detailTitle').textContent=el.value||'構築詳細'});document.querySelectorAll('[data-overall]').forEach(el=>el.oninput=()=>{t.overallMemo[el.dataset.overall]=el.value;t.updatedAt=new Date().toISOString();scheduleSave()});document.querySelectorAll('[data-poke-index]').forEach(el=>{el.onchange=()=>{const i=+el.dataset.pokeIndex;t.pokemon[i]=el.value.trim();if(isMegaPokemon(t.pokemon[i]))t.items[i]='メガストーン';ensureTeamAdjustments(t);t.updatedAt=new Date().toISOString();scheduleSave();renderDetail()};attachAutocomplete(el,'pokemon')});document.querySelectorAll('[data-item-index]').forEach(el=>{const i=+el.dataset.itemIndex;if(isMegaPokemon(t.pokemon[i])){el.value='メガストーン';el.disabled=true;el.title='メガシンカのため持ち物はメガストーン固定です'}el.onchange=()=>{t.items[i]=isMegaPokemon(t.pokemon[i])?'メガストーン':el.value.trim();ensureTeamAdjustments(t);t.updatedAt=new Date().toISOString();scheduleSave();renderDetail()};attachAutocomplete(el,'item')});document.querySelectorAll('[data-ability-index]').forEach(el=>{const i=+el.dataset.abilityIndex;el.onchange=()=>{t.abilities[i]=el.value.trim();ensureTeamAdjustments(t);scheduleSave();renderDetail()};attachAbilityAutocomplete(el,()=>t.pokemon[i])});document.querySelectorAll('[data-nature-index]').forEach(el=>{const i=+el.dataset.natureIndex;el.value=t.natures[i]||'';el.onchange=()=>{t.natures[i]=el.value;ensureTeamAdjustments(t);scheduleSave();renderDetail()}});
    document.querySelectorAll('[data-add-card]').forEach(b=>b.onclick=()=>{const k=b.dataset.addCard;if(k==='pokemonChanges')t[k].push({from:'',to:'',reason:'',status:'未検証'});if(k==='moveChanges')t[k].push({pokemon:'',fromMove:'',toMove:'',reason:'',status:'未検証'});if(k==='favorableMatchups'||k==='unfavorableMatchups')t[k].push({_key:k,linkedTeamId:'',title:'',source:'',pokemon:Array(6).fill(''),reason:'',plan:''});scheduleSave();renderDetail()});
    document.querySelectorAll('.memo-card').forEach(card=>{const key=card.dataset.card,idx=+card.dataset.index,item=t[key][idx];card.querySelectorAll('[data-c]').forEach(el=>{if(el.tagName==='SELECT')el.value=item[el.dataset.c]||'未検証';el.oninput=()=>{item[el.dataset.c]=el.value;t.updatedAt=new Date().toISOString();scheduleSave();const p=card.querySelector(`[data-preview="${el.dataset.c}"]`);if(p){p.dataset.pokemon=el.value;p.src=imgFor(el.value);hydrateImages(card)}if(key==='adjustments'){if(el.dataset.c==='item')t.items[idx]=isMegaPokemon(t.pokemon[idx])?'メガストーン':el.value;if(el.dataset.c==='ability')t.abilities[idx]=el.value;if(el.dataset.c==='nature')t.natures[idx]=el.value;ensureTeamAdjustments(t);updateStatCard(card,item)}}});card.querySelectorAll('[data-match-poke]').forEach(el=>el.onchange=()=>{item.pokemon=item.pokemon||Array(6).fill('');item.pokemon[+el.dataset.matchPoke]=el.value.trim();item.linkedTeamId='';t.updatedAt=new Date().toISOString();scheduleSave();renderDetail()});card.querySelectorAll('[data-ev]').forEach(el=>el.oninput=()=>{item.ev=item.ev||{};const key=el.dataset.ev;const others=['H','A','B','C','D','S'].filter(k=>k!==key).reduce((sum,k)=>sum+clampNum(item.ev[k]??0,0,32),0);const allowed=Math.max(0,Math.min(32,64-others));item.ev[key]=Math.min(clampNum(el.value,0,32),allowed);el.value=item.ev[key];scheduleSave();updateStatCard(card,item)});card.querySelectorAll('[data-iv]').forEach(el=>el.oninput=()=>{item.iv=item.iv||{};item.iv[el.dataset.iv]=clampNum(el.value,0,31);scheduleSave();updateStatCard(card,item)});card.querySelectorAll('[data-move-slot]').forEach(el=>{el.oninput=()=>{item.moveSlots=item.moveSlots||['','','',''];item.moveSlots[+el.dataset.moveSlot]=el.value;item.moves=item.moveSlots.filter(Boolean).join(' / ');t.updatedAt=new Date().toISOString();scheduleSave()};attachAutocomplete(el,'move')});card.querySelectorAll('[data-move-alt]').forEach(el=>{el.oninput=()=>{item.moveAlternatives=item.moveAlternatives||['','','',''];item.moveAlternatives[+el.dataset.moveAlt]=el.value;t.updatedAt=new Date().toISOString();scheduleSave()};attachAutocomplete(el,'move')});if(key==='adjustments')updateStatCard(card,item);
      const search=card.querySelector('[data-match-search]');if(search){const results=card.querySelector('.matchup-results');const hide=()=>setTimeout(()=>results.classList.remove('show'),150);search.oninput=()=>{const matches=matchupSearchResults(search.value);results.innerHTML=matches.length?matches.map(team=>`<button class="matchup-result" type="button" data-team-choice="${team.id}"><strong>${esc(team.user||'使用者未登録')} / ${esc(team.rank||'順位未登録')} / ${esc(team.title||'構築名未登録')}</strong><small>${esc((team.pokemon||[]).filter(Boolean).join(' / '))}</small></button>`).join(''):'<div class="sub" style="padding:10px">該当する構築がありません。下の欄へ直接入力できます。</div>';results.classList.add('show');results.querySelectorAll('[data-team-choice]').forEach(btn=>btn.onclick=()=>{const team=state.teams.find(x=>x.id===btn.dataset.teamChoice);if(!team)return;applyTeamToMatchup(item,team);t.updatedAt=new Date().toISOString();scheduleSave();renderDetail()})};search.onblur=hide;const clear=card.querySelector('[data-clear-link]');if(clear)clear.onclick=()=>{item.linkedTeamId='';scheduleSave();renderDetail()}}
      card.querySelectorAll('[data-c="pokemon"]').forEach(el=>attachAutocomplete(el,'pokemon',()=>{if(key==='adjustments'&&isMegaPokemon(el.value)){item.item='メガストーン';scheduleSave();renderDetail()}}));if(key==='pokemonChanges'){card.querySelectorAll('[data-c="from"],[data-c="to"]').forEach(el=>attachAutocomplete(el,'pokemon'))}if(key==='adjustments'){const cand=card.querySelector('[data-c="pokemonCandidate"]');if(cand)attachAutocomplete(cand,'pokemon');const itemInput=card.querySelector('[data-c="item"]');if(itemInput){if(isMegaPokemon(item.pokemon)){item.item='メガストーン';itemInput.value='メガストーン';itemInput.disabled=true;itemInput.title='メガシンカのため持ち物はメガストーン固定です'}attachAutocomplete(itemInput,'item')}const abilityInput=card.querySelector('[data-c="ability"]');if(abilityInput)attachAbilityAutocomplete(abilityInput,()=>item.pokemon)}card.querySelectorAll('[data-match-poke]').forEach(el=>attachAutocomplete(el,'pokemon'));
      const del=card.querySelector('.delete-card');if(del)del.onclick=()=>{if(confirm('この項目を削除しますか？')){t[key].splice(idx,1);scheduleSave();renderDetail()}}})}


  function clampNum(v,min,max){const n=Number(v);return Number.isFinite(n)?Math.max(min,Math.min(max,Math.trunc(n))):min}
  function effortPointToEV(v){const p=clampNum(v,0,32);return p<=0?0:Math.min(252,4+(p-1)*8)}
  function legacyEVToPoint(v){const n=Number(v)||0;if(n<=32)return clampNum(n,0,32);return Math.min(32,Math.max(0,Math.round((n+4)/8)))}
  function natureMultiplier(nature,stat){const n=NATURES[nature]||{};if(n.up===stat)return 1.1;if(n.down===stat)return .9;return 1}
  function calculateStats(base,item){const keys=['H','A','B','C','D','S'],out={};for(const k of keys){const b=Number(base[k]||0),iv=clampNum(item.iv?.[k]??31,0,31),ev=effortPointToEV(item.ev?.[k]??0);if(k==='H')out[k]=Math.floor(((2*b+iv+Math.floor(ev/4))*50)/100)+60;else{const raw=Math.floor(((2*b+iv+Math.floor(ev/4))*50)/100)+5;out[k]=Math.floor(raw*natureMultiplier(item.nature,k))}}return out}
  async function updateStatCard(card,item){
    item.ev=sanitizeEffortObject(item.ev||{});
    card.querySelectorAll('[data-ev]').forEach(el=>{el.value=item.ev[el.dataset.ev]??0});
    const remaining=effortRemaining(item.ev),remainEl=card.querySelector('[data-ev-remaining]');if(remainEl){remainEl.textContent=`残り ${remaining}`;remainEl.classList.toggle('complete',remaining===0)}
    const effortLine=`振り方：${['H','A','B','C','D','S'].map(k=>`${k}${item.ev[k]||0}`).join(', ')}`;
    const partyEffort=document.querySelector(`[data-party-effort="${card.dataset.index}"]`);if(partyEffort)partyEffort.textContent=effortLine;
    const note=card.querySelector('[data-stat-note]');if(!card.isConnected)return;if(note)note.textContent='種族値を取得中…';const d=await pokemonData(item.pokemon);if(!card.isConnected)return;if(!d){card.querySelectorAll('[data-stat-output]').forEach(o=>o.textContent='－');const top=document.querySelector(`[data-party-stat="${card.dataset.index}"]`);if(top)top.textContent='調整後：H－, A－, B－, C－, D－, S－';if(note)note.textContent='ポケモン名を確認してください。メガ・リージョンフォームにも対応しています。';return}const map={hp:'H',attack:'A',defense:'B','special-attack':'C','special-defense':'D',speed:'S'},base={};d.stats.forEach(x=>base[map[x.stat.name]]=x.base_stat);const vals=calculateStats(base,item);card.querySelectorAll('[data-stat-output]').forEach(o=>o.textContent=vals[o.dataset.statOutput]??'－');const top=document.querySelector(`[data-party-stat="${card.dataset.index}"]`);if(top)top.textContent=`調整後：${statSummary(vals)}`;if(note)note.textContent=`種族値：H${base.H} A${base.A} B${base.B} C${base.C} D${base.D} S${base.S} ／ Lv50`;}



  function registeredPokemonNames(){
    const names=[];state.teams.forEach(t=>(t.pokemon||[]).forEach(n=>{n=String(n||'').trim();if(n)names.push(n)}));
    return [...new Set(names)].sort((a,b)=>a.localeCompare(b,'ja'));
  }
  function pokemonOccurrences(name){
    const target=normalizePokemonName(name),rows=[];
    state.teams.forEach(team=>{ensureTeamAdjustments(team);(team.pokemon||[]).forEach((n,i)=>{if(normalizePokemonName(n)!==target)return;const a=team.adjustments[i]||blankAdjustment();rows.push({team,index:i,adjustment:a,updatedAt:team.updatedAt||''})})});
    return rows.sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)));
  }
  function splitMoves(v){if(Array.isArray(v))return v.filter(Boolean).slice(0,4);return String(v||'').split(/[\/、,，\n]+/).map(x=>x.trim()).filter(Boolean).slice(0,4)}
  function effortText(obj){return ['H','A','B','C','D','S'].map(k=>`${k}${clampNum(obj?.[k]??0,0,32)}`).join(' ')}
  function individualText(obj){return ['H','A','B','C','D','S'].map(k=>`${k}${clampNum(obj?.[k]??31,0,31)}`).join(' ')}
  function hideAllViews(){['listView','detailView','pokemonView'].forEach(id=>$('#'+id)?.classList.remove('active'))}
  function openPokemonSearch(){
    const modal=$('#pokemonSearchModal'),input=$('#pokemonIndexSearch');renderPokemonQuickList();modal.classList.add('show');input.value='';input.focus();renderPokemonIndexSuggestions('');
  }
  function renderPokemonQuickList(){const names=registeredPokemonNames();$('#pokemonIndexQuickList').innerHTML=names.length?names.map(n=>`<button class="pokemon-chip" data-pokemon-page="${esc(n)}">${esc(n)}（${pokemonOccurrences(n).length}）</button>`).join(''):'<div class="empty">まだ構築にポケモンが登録されていません。</div>';bindPokemonPageButtons($('#pokemonIndexQuickList'))}
  function renderPokemonIndexSuggestions(q){
    const box=$('#pokemonIndexSuggestions'),norm=searchNorm(q);let names=registeredPokemonNames();if(norm)names=names.filter(n=>searchNorm(n).includes(norm)).sort((a,b)=>Number(searchNorm(b).startsWith(norm))-Number(searchNorm(a).startsWith(norm))||a.localeCompare(b,'ja'));names=names.slice(0,30);box.innerHTML=names.map(n=>`<button type="button" class="autocomplete-option" data-pokemon-page="${esc(n)}">${esc(n)} <small>${pokemonOccurrences(n).length}件</small></button>`).join('');box.classList.toggle('show',names.length>0);bindPokemonPageButtons(box)
  }
  function bindPokemonPageButtons(root=document){root.querySelectorAll('[data-pokemon-page]').forEach(b=>b.onclick=()=>{const n=b.dataset.pokemonPage;$('#pokemonSearchModal').classList.remove('show');openPokemonPage(n)})}
  async function openPokemonPage(name){
    state.currentPokemon=name;hideAllViews();$('#pokemonView').classList.add('active');$('#pokemonPageTitle').textContent=`${name}の登録一覧`;await renderPokemonPage();scrollTo(0,0)
  }
  async function renderPokemonPage(){
    const name=state.currentPokemon,occ=pokemonOccurrences(name),content=$('#pokemonPageContent');
    content.innerHTML=`<div class="pokemon-profile"><img class="pokemon-profile-image" data-pokemon="${esc(name)}"><div><h2>${esc(name)}</h2><div class="sub">登録 ${occ.length}件</div><div id="pokemonProfileAbilities" style="margin-top:10px">特性：取得中…</div><div class="sub" style="margin-top:8px">基準個体値：H31 A31 B31 C31 D31 S31 ／ 努力値0 ／ 無補正 ／ Lv50</div><div id="pokemonProfileStats" class="profile-stat-grid"></div></div></div><div class="section"><h3>登録された型</h3><p class="sub">更新日の新しい順です。</p><div id="pokemonSetList" class="pokemon-sets">${occ.length?occ.map(pokemonSetCard).join(''):'<div class="empty">該当する登録がありません。</div>'}</div></div>`;
    hydrateImages(content);content.querySelectorAll('[data-open-team]').forEach(b=>b.onclick=()=>openDetail(b.dataset.openTeam,{type:'pokemon',name}));
    const d=await pokemonData(name);if(d){const map={hp:'H',attack:'A',defense:'B','special-attack':'C','special-defense':'D',speed:'S'},base={};d.stats.forEach(x=>base[map[x.stat.name]]=x.base_stat);const vals=calculateStats(base,{nature:'',iv:{H:31,A:31,B:31,C:31,D:31,S:31},ev:{H:0,A:0,B:0,C:0,D:0,S:0}});$('#pokemonProfileStats').innerHTML=['H','A','B','C','D','S'].map(k=>`<div class="profile-stat"><small>${k}</small><br>${vals[k]}</div>`).join('');const abilities=await abilityNamesForPokemon(name);$('#pokemonProfileAbilities').textContent=`特性：${abilities.join(' / ')||'未取得'}`}
    for(const row of occ){const card=content.querySelector(`[data-set-key="${row.team.id}-${row.index}"]`);if(card)updatePokemonSetStats(card,row.adjustment)}
  }
  function pokemonSetCard(row){
    const {team,index,adjustment:a}=row,moves=splitMoves(a.moves);while(moves.length<4)moves.push('－');return `<article class="pokemon-set-card" data-set-key="${team.id}-${index}"><div class="pokemon-set-head"><div><strong>${esc(team.title||'構築名未登録')}</strong><div class="pokemon-set-meta">${esc(team.user||'使用者未登録')} / ${esc(team.rank||'順位未登録')} / ${esc(team.season||'未分類')} / 更新 ${esc((team.updatedAt||'').slice(0,10)||'－')}</div></div><button class="btn primary" data-open-team="${team.id}">詳細</button></div><div class="set-two-rows"><div><div class="set-info"><div class="set-cell"><b>特性</b>${esc(a.ability||team.abilities?.[index]||'－')}</div><div class="set-cell"><b>持ち物</b>${esc(a.item||team.items?.[index]||'－')}</div><div class="set-cell"><b>性格</b>${esc(natureLabel(a.nature||team.natures?.[index]||'')||'－')}</div><div class="set-cell"><b>努力値</b><span class="ev-line">${effortText(a.ev)}</span></div><div class="set-cell"><b>調整後実数値</b><span class="stat-line" data-set-stats>計算中…</span></div></div><div class="set-moves">${moves.map(m=>`<div class="move-pill">${esc(m)}</div>`).join('')}</div><div class="sub" style="margin-top:8px">個体値：<span class="iv-line">${individualText(a.iv)}</span></div></div></div></article>`}
  async function updatePokemonSetStats(card,a){const d=await pokemonData(a.pokemon||state.currentPokemon);if(!d)return;const map={hp:'H',attack:'A',defense:'B','special-attack':'C','special-defense':'D',speed:'S'},base={};d.stats.forEach(x=>base[map[x.stat.name]]=x.base_stat);const vals=calculateStats(base,a);const el=card.querySelector('[data-set-stats]');if(el)el.textContent=statSummary(vals)}
  function closePokemonPage(){hideAllViews();$('#listView').classList.add('active');renderList();renderFilters();scrollTo(0,0)}

  function addTeam(){const t=blankTeam();state.teams.unshift(t);scheduleSave();openDetail(t.id)}
  function duplicateCurrent(){const t=current();const copy=structuredClone(t);copy.id=uid();copy.title=(copy.title||'構築')+' コピー';copy.updatedAt=new Date().toISOString();state.teams.unshift(copy);state.currentId=copy.id;scheduleSave();renderDetail();toast('複製しました')}
  function deleteCurrent(){const t=current();if(!t||!confirm('この構築を削除しますか？'))return;state.teams=state.teams.filter(x=>x.id!==t.id);scheduleSave();backToList()}
  function backToList(){if(state.detailReturn?.type==='pokemon'){const name=state.detailReturn.name;state.currentId=null;state.detailReturn=null;openPokemonPage(name);return}$('#detailView').classList.remove('active');$('#pokemonView').classList.remove('active');$('#listView').classList.add('active');state.currentId=null;state.detailReturn=null;renderList();renderFilters();scrollTo(0,0)}
  function exportData(){const blob=new Blob([JSON.stringify({version:7,exportedAt:new Date().toISOString(),teams:state.teams,seasons:state.seasons},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`pokemon-teams-v7-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href)}
  function importData(file){if(!file)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!Array.isArray(d.teams))throw Error();if(!confirm('現在のデータを読み込みデータで置き換えますか？'))return;state.teams=d.teams;state.imageMap=d.imageMap||state.imageMap||{};state.seasons=Array.isArray(d.seasons)&&d.seasons.length?d.seasons:['未分類'];state.currentSeason='all';state.teams.forEach(t=>{t.favorableMatchups=(t.favorableMatchups||[]).map(x=>({...x,_key:'favorableMatchups',linkedTeamId:x.linkedTeamId||'',pokemon:Array.isArray(x.pokemon)?Array.from({length:6},(_,i)=>x.pokemon[i]||''):Array(6).fill('')}));t.unfavorableMatchups=(t.unfavorableMatchups||[]).map(x=>({...x,_key:'unfavorableMatchups',linkedTeamId:x.linkedTeamId||'',pokemon:Array.isArray(x.pokemon)?Array.from({length:6},(_,i)=>x.pokemon[i]||''):Array(6).fill('')}));t.overallMemo=t.overallMemo||{lead:'',weak:'',improve:'',battle:'',free:''}});scheduleSave();renderList();renderFilters();toast('読み込みました')}catch{alert('正しいバックアップファイルではありません。')}};r.readAsText(file)}

  function normalizeFirebaseConfig(text){
    let v=text.trim();
    v=v.replace(/^const\s+firebaseConfig\s*=\s*/, '').replace(/^firebaseConfig\s*=\s*/, '').replace(/;\s*$/, '');
    v=v.replace(/([{,]\s*)([A-Za-z_$][\w$]*)(\s*:)/g,'$1"$2"$3').replace(/'/g,'"');
    return JSON.parse(v);
  }
  async function loadFirebaseSdk(){
    if(cloud.api)return;
    const v='12.0.0';
    const app=await import(`https://www.gstatic.com/firebasejs/${v}/firebase-app.js`);
    const auth=await import(`https://www.gstatic.com/firebasejs/${v}/firebase-auth.js`);
    const fs=await import(`https://www.gstatic.com/firebasejs/${v}/firebase-firestore.js`);
    cloud.api={...app,...auth,...fs};
  }
  async function initFirebase(config){
    await loadFirebaseSdk();
    const {initializeApp,getApps,getApp,getAuth,GoogleAuthProvider,onAuthStateChanged,getFirestore}=cloud.api;
    const app=getApps().length?getApp():initializeApp(config);
    cloud.auth=getAuth(app);cloud.db=getFirestore(app);cloud.storage=null;cloud.configured=true;
    onAuthStateChanged(cloud.auth,async user=>{cloud.user=user||null;updateAccountUI();if(user)await loadCloudData()});
  }
  function updateAccountUI(){
    const logged=!!cloud.user;$('#loginBtn').style.display=logged?'none':'';$('#logoutBtn').style.display=logged?'':'none';
    $('#userPhoto').style.display=logged&&cloud.user.photoURL?'':'none';if(logged&&cloud.user.photoURL)$('#userPhoto').src=cloud.user.photoURL;
    setSyncText(logged?`${cloud.user.displayName||'Google'}・同期準備中`:(cloud.configured?'未ログイン':'この端末に保存'));
  }
  async function loginGoogle(){
    if(location.protocol==='file:'){alert('GoogleログインはHTMLを直接開いた状態では使えません。Firebase HostingまたはGitHub Pagesに公開してから開いてください。');return}
    if(!cloud.configured){openFirebaseModal();return}
    try{const {GoogleAuthProvider,signInWithPopup}=cloud.api;await signInWithPopup(cloud.auth,new GoogleAuthProvider())}catch(e){console.error(e);alert('Googleログインに失敗しました。Firebase AuthenticationでGoogleを有効にし、現在のドメインを承認済みドメインに追加してください。')}
  }
  async function logoutGoogle(){if(cloud.auth){await cloud.api.signOut(cloud.auth);setSyncText('この端末に保存')}}
  async function loadCloudData(){
    try{const {doc,getDoc}=cloud.api;const snap=await getDoc(doc(cloud.db,'users',cloud.user.uid,'apps','pokemon-team-manager'));
      if(snap.exists()){
        const d=snap.data();
        const localHas=state.teams.length>0;
        const useCloud=!localHas||confirm('クラウドに保存済みのデータがあります。クラウド版をこの端末に読み込みますか？\n\n「キャンセル」を選ぶと、この端末のデータをクラウドへ上書きします。');
        if(useCloud){state.teams=d.teams||[];state.seasons=d.seasons||['未分類'];state.currentSeason=d.currentSeason||'all';state.teamScope=d.teamScope||'world';await dbSet('data',payload());normalizeState();renderSeasons();renderFilters();renderTeamScopeTabs();renderList();if(state.currentId)renderDetail();toast('クラウドデータを読み込みました')}
        else await migrateLocalImagesAndSave();
      }else await migrateLocalImagesAndSave();
      setSyncText('クラウド同期済み');
    }catch(e){console.error(e);setSyncText('クラウド読込エラー');alert('クラウドデータを読み込めませんでした。Firestoreの作成とセキュリティルールを確認してください。')}
  }
  async function migrateLocalImagesAndSave(){await dbSet('data',payload());await saveCloud()}

  function openFirebaseModal(){const saved=localStorage.getItem('pokemonFirebaseConfig');$('#firebaseConfigInput').value=saved?JSON.stringify(JSON.parse(saved),null,2):'';$('#firebaseModal').classList.add('show')}
  async function saveFirebaseConfig(){try{const c=normalizeFirebaseConfig($('#firebaseConfigInput').value);for(const k of ['apiKey','authDomain','projectId','appId'])if(!c[k])throw new Error(k);localStorage.setItem('pokemonFirebaseConfig',JSON.stringify(c));$('#firebaseModal').classList.remove('show');await initFirebase(c);toast('Firebase設定を保存しました')}catch(e){console.error(e);alert('設定を読み取れませんでした。firebaseConfigのオブジェクトをそのまま貼り付けてください。')}}
  function normalizeState(){state.seasons=Array.isArray(state.seasons)&&state.seasons.length?state.seasons:['未分類'];state.teams=Array.isArray(state.teams)?state.teams:[];state.imageMap=state.imageMap||{};state.teams.forEach(t=>{t.season=t.season||'未分類';t.owner=t.owner==='self'?'self':'other';if(!state.seasons.includes(t.season))state.seasons.push(t.season);t.pokemon=Array.from({length:6},(_,i)=>(t.pokemon||[])[i]||'');t.items=Array.from({length:6},(_,i)=>(t.items||[])[i]||'');t.abilities=Array.from({length:6},(_,i)=>(t.abilities||[])[i]||((t.adjustments||[])[i]?.ability||''));t.natures=Array.from({length:6},(_,i)=>(t.natures||[])[i]||((t.adjustments||[])[i]?.nature||''));t.pokemonChanges=t.pokemonChanges||[];t.moveChanges=t.moveChanges||[];t.adjustments=Array.from({length:6},(_,i)=>{const a=(t.adjustments||[])[i]||blankAdjustment();return {...a,pokemon:t.pokemon[i],item:t.items[i],ability:t.abilities[i],nature:t.natures[i],iv:{H:31,A:31,B:31,C:31,D:31,S:31,...(a.iv||{})},ev:sanitizeEffortObject(Object.fromEntries(['H','A','B','C','D','S'].map(k=>[k,legacyEVToPoint(({H:0,A:0,B:0,C:0,D:0,S:0,...(a.ev||{})})[k])])) )}});t.favorableMatchups=(t.favorableMatchups||[]).map(x=>({...x,_key:'favorableMatchups',linkedTeamId:x.linkedTeamId||'',pokemon:Array.isArray(x.pokemon)?Array.from({length:6},(_,i)=>x.pokemon[i]||''):Array(6).fill('')}));t.unfavorableMatchups=(t.unfavorableMatchups||[]).map(x=>({...x,_key:'unfavorableMatchups',linkedTeamId:x.linkedTeamId||'',pokemon:Array.isArray(x.pokemon)?Array.from({length:6},(_,i)=>x.pokemon[i]||''):Array(6).fill('')}));t.overallMemo=t.overallMemo||{lead:'',weak:'',improve:'',battle:'',free:''}})}
  function openSettingsMenu(){const menu=$('#settingsMenu');if(!menu)return;menu.classList.add('show');menu.setAttribute('aria-hidden','false');$('#menuBtn')?.setAttribute('aria-expanded','true');document.body.classList.add('menu-open')}
  function closeSettingsMenu(){const menu=$('#settingsMenu');if(!menu)return;menu.classList.remove('show');menu.setAttribute('aria-hidden','true');$('#menuBtn')?.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')}
  async function init(){await openDB();const saved=await dbGet('data');if(saved){state.teams=saved.teams||[];state.imageMap=saved.imageMap||{};state.seasons=saved.seasons||['未分類'];state.currentSeason=saved.currentSeason||'all';state.teamScope=saved.teamScope||'world'}normalizeState();renderSeasons();renderFilters();renderTeamScopeTabs();renderList();$('#menuBtn').onclick=openSettingsMenu;$('#closeMenuBtn').onclick=closeSettingsMenu;$('#settingsMenu').onclick=e=>{if(e.target===$('#settingsMenu'))closeSettingsMenu()};document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSettingsMenu()});$('#searchInput').oninput=e=>{state.query=e.target.value;renderList()};$('#pokemonSearchBtn').onclick=openPokemonSearch;$('#closePokemonSearchModal').onclick=()=>$('#pokemonSearchModal').classList.remove('show');$('#pokemonSearchModal').onclick=e=>{if(e.target===$('#pokemonSearchModal'))$('#pokemonSearchModal').classList.remove('show')};$('#pokemonIndexSearch').oninput=e=>renderPokemonIndexSuggestions(e.target.value);$('#pokemonIndexSearch').onkeydown=e=>{if(e.key==='Enter'){const first=$('#pokemonIndexSuggestions [data-pokemon-page]');if(first)first.click()}};$('#pokemonBackBtn').onclick=closePokemonPage;$('#newTeamBtn').onclick=$('#floatingAdd').onclick=addTeam;$('#addSeasonBtn').onclick=addSeason;$('#renameSeasonBtn').onclick=renameSeason;$('#deleteSeasonBtn').onclick=deleteSeason;$('#backBtn').onclick=backToList;$('#duplicateBtn').onclick=duplicateCurrent;$('#deleteTeamBtn').onclick=deleteCurrent;$('#exportBtn').onclick=exportData;$('#importBtn').onclick=()=>$('#importFile').click();$('#importFile').onchange=e=>importData(e.target.files[0]);$('#closeTagModal').onclick=()=>$('#tagModal').classList.remove('show');$('#tagModal').onclick=e=>{if(e.target===$('#tagModal'))$('#tagModal').classList.remove('show')};
    $('#firebaseSetupBtn').onclick=openFirebaseModal;$('#loginBtn').onclick=loginGoogle;$('#logoutBtn').onclick=logoutGoogle;$('#saveFirebaseConfig').onclick=saveFirebaseConfig;$('#closeFirebaseModal').onclick=()=>$('#firebaseModal').classList.remove('show');$('#firebaseModal').onclick=e=>{if(e.target===$('#firebaseModal'))$('#firebaseModal').classList.remove('show')};
    const cfg=localStorage.getItem('pokemonFirebaseConfig');try{await initFirebase(cfg?JSON.parse(cfg):DEFAULT_FIREBASE_CONFIG)}catch(e){console.error(e);setSyncText('Firebase設定エラー')}
  }
  init().catch(e=>{console.error(e);alert('データベースの初期化に失敗しました。プライベートブラウズでは保存できない場合があります。')});
})();
