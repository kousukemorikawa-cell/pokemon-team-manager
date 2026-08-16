(() => {
  const DB_NAME='pokemon-team-manager-v1', STORE='app';
  const state={teams:[], pairings:[], pokemonRelations:[], savedMoves:[], battleRecords:[], damageHistory:[], imageMap:{}, seasons:['未分類'], currentSeason:'all', teamScope:'world', filter:'all', query:'', sortOrder:'manual', currentId:null, currentPokemon:'', detailReturn:null, historyPick:null,damageSetPick:null,currentPairingId:null,pairingMode:'browse',pairingReturnTeamId:null,pairingQuery:'',pairingStatusFilter:'all',pokemonReturnView:null,battleReturnTeamId:null,battleFormCache:null,teamPickerKind:'self',teamPickerArmedId:'',someoneTeamsOnly:false,damageHistoryReturn:'menu'};
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
,
    "メガライチュウX":'__custom__',"メガライチュウY":'__custom__',"メガムクホーク":'__custom__',"メガペンドラー":'__custom__',"メガズルズキン":'__custom__',"メガシビルドン":'__custom__',"メガカエンジシ":'__custom__',"メガカラマネロ":'__custom__',"メガガメノデス":'__custom__',"メガドラミドロ":'__custom__',"メガタイレーツ":'__custom__',"メガピクシー":'__custom__',"メガウツボット":'__custom__',"メガスターミー":'__custom__',"メガカイリュー":'__custom__',"メガメガニウム":'__custom__',"メガオーダイル":'__custom__',"メガエアームド":'__custom__',"メガチリーン":'__custom__',"メガユキメノコ":'__custom__',"メガエンブオー":'__custom__',"メガドリュウズ":'__custom__',"メガシャンデラ":'__custom__',"メガゴルーグ":'__custom__',"メガブリガロン":'__custom__',"メガマフォクシー":'__custom__',"メガゲッコウガ":'__custom__',"メガニャオニクス♂":'__custom__',"メガニャオニクス♀":'__custom__',"メガルチャブル":'__custom__',"メガケケンカニ":'__custom__',"メガジジーロン":'__custom__',"メガスコヴィラン":'__custom__',"メガキラフロル":'__custom__',"メガルカリオZ":'__custom__',"メガガブリアスZ":'__custom__',"メガアブソルZ":'__custom__',"メガゼラオラ":'__custom__',"メガセグレイブ":'__custom__',"メガグソクムシャ":'__custom__',"メガダークライ":'__custom__',"メガヒードラン":'__custom__',"メガジガルデ":'__custom__',"メガフラエッテ":'__custom__',"メガマギアナ":'__custom__',"メガシャリタツ（そったすがた）":'__custom__',"メガシャリタツ（たれたすがた）":'__custom__',"メガシャリタツ（のびたすがた）":'__custom__'
  };
  const CUSTOM_POKEMON_FORMS={"メガライチュウX":{"dex":"0026","form":"Mega-X","base":"raichu","stats":[60,135,95,90,95,110],"ability":"エレキメイカー"},"メガライチュウY":{"dex":"0026","form":"Mega-Y","base":"raichu","stats":[60,100,55,160,80,130],"ability":"ノーガード"},"メガムクホーク":{"dex":"0398","form":"Mega","base":"staraptor","stats":[85,140,100,60,90,110],"ability":"あまのじゃく"},"メガペンドラー":{"dex":"0545","form":"Mega","base":"scolipede","stats":[60,140,149,75,99,62],"ability":"シェルアーマー"},"メガズルズキン":{"dex":"0560","form":"Mega","base":"scrafty","stats":[65,130,135,55,135,68],"ability":"いかく"},"メガシビルドン":{"dex":"0604","form":"Mega","base":"eelektross","stats":[85,145,80,135,90,80],"ability":"うなぎのぼり"},"メガカエンジシ":{"dex":"0668","form":"Mega","base":"pyroar","stats":[86,88,92,129,86,126],"ability":"ほのおのたてがみ"},"メガカラマネロ":{"dex":"0687","form":"Mega","base":"malamar","stats":[86,102,88,98,120,88],"ability":"あまのじゃく"},"メガガメノデス":{"dex":"0689","form":"Mega","base":"barbaracle","stats":[72,140,130,64,106,88],"ability":"かたいツメ"},"メガドラミドロ":{"dex":"0691","form":"Mega","base":"dragalge","stats":[65,85,105,132,163,44],"ability":"さいせいりょく"},"メガタイレーツ":{"dex":"0870","form":"Mega","base":"falinks","stats":[65,135,135,70,65,100],"ability":"まけんき"},"メガピクシー":{"dex":"0036","form":"Mega","base":"clefable"},"メガウツボット":{"dex":"0071","form":"Mega","base":"victreebel"},"メガスターミー":{"dex":"0121","form":"Mega","base":"starmie"},"メガカイリュー":{"dex":"0149","form":"Mega","base":"dragonite","stats":[91,124,115,145,125,100]},"メガメガニウム":{"dex":"0154","form":"Mega","base":"meganium"},"メガオーダイル":{"dex":"0160","form":"Mega","base":"feraligatr"},"メガエアームド":{"dex":"0227","form":"Mega","base":"skarmory"},"メガチリーン":{"dex":"0358","form":"Mega","base":"chimecho"},"メガユキメノコ":{"dex":"0478","form":"Mega","base":"froslass"},"メガエンブオー":{"dex":"0500","form":"Mega","base":"emboar"},"メガドリュウズ":{"dex":"0530","form":"Mega","base":"excadrill"},"メガシャンデラ":{"dex":"0609","form":"Mega","base":"chandelure"},"メガゴルーグ":{"dex":"0623","form":"Mega","base":"golurk"},"メガブリガロン":{"dex":"0652","form":"Mega","base":"chesnaught"},"メガマフォクシー":{"dex":"0655","form":"Mega","base":"delphox"},"メガゲッコウガ":{"dex":"0658","form":"Mega","base":"greninja"},"メガニャオニクス♂":{"dex":"0678","form":"Mega-Male","base":"meowstic-male"},"メガニャオニクス♀":{"dex":"0678","form":"Mega-Female","base":"meowstic-female"},"メガルチャブル":{"dex":"0701","form":"Mega","base":"hawlucha"},"メガケケンカニ":{"dex":"0740","form":"Mega","base":"crabominable"},"メガジジーロン":{"dex":"0780","form":"Mega","base":"drampa"},"メガスコヴィラン":{"dex":"0952","form":"Mega","base":"scovillain"},"メガキラフロル":{"dex":"0970","form":"Mega","base":"glimmora"},"メガルカリオZ":{"dex":"0448","form":"Mega-Z","base":"lucario"},"メガガブリアスZ":{"dex":"0445","form":"Mega-Z","base":"garchomp"},"メガアブソルZ":{"dex":"0359","form":"Mega-Z","base":"absol"},"メガゼラオラ":{"dex":"0807","form":"Mega","base":"zeraora"},"メガセグレイブ":{"dex":"0998","form":"Mega","base":"baxcalibur"},"メガグソクムシャ":{"dex":"0768","form":"Mega","base":"golisopod"},"メガダークライ":{"dex":"0491","form":"Mega","base":"darkrai"},"メガヒードラン":{"dex":"0485","form":"Mega","base":"heatran"},"メガジガルデ":{"dex":"0718","form":"Mega","base":"zygarde-50"},"メガフラエッテ":{"dex":"0670","form":"Mega","base":"floette"},"メガマギアナ":{"dex":"0801","form":"Mega","base":"magearna"},"メガシャリタツ（そったすがた）":{"dex":"0978","form":"Mega-Curly","base":"tatsugiri-curly"},"メガシャリタツ（たれたすがた）":{"dex":"0978","form":"Mega-Droopy","base":"tatsugiri-droopy"},"メガシャリタツ（のびたすがた）":{"dex":"0978","form":"Mega-Stretchy","base":"tatsugiri-stretchy"}};
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
  const MEGA_STONES={
  'メガフシギバナ':'フシギバナイト','メガリザードンX':'リザードナイトX','メガリザードンY':'リザードナイトY','メガカメックス':'カメックスナイト',
  'メガスピアー':'スピアナイト','メガピジョット':'ピジョットナイト','メガフーディン':'フーディナイト','メガヤドラン':'ヤドランナイト',
  'メガゲンガー':'ゲンガナイト','メガガルーラ':'ガルーラナイト','メガカイロス':'カイロスナイト','メガギャラドス':'ギャラドスナイト',
  'メガプテラ':'プテラナイト','メガミュウツーX':'ミュウツナイトX','メガミュウツーY':'ミュウツナイトY','メガデンリュウ':'デンリュウナイト',
  'メガハガネール':'ハガネールナイト','メガハッサム':'ハッサムナイト','メガヘラクロス':'ヘラクロスナイト','メガヘルガー':'ヘルガナイト',
  'メガバンギラス':'バンギラスナイト','メガジュカイン':'ジュカインナイト','メガバシャーモ':'バシャーモナイト','メガラグラージ':'ラグラージナイト',
  'メガサーナイト':'サーナイトナイト','メガヤミラミ':'ヤミラミナイト','メガクチート':'クチートナイト','メガボスゴドラ':'ボスゴドラナイト',
  'メガチャーレム':'チャーレムナイト','メガライボルト':'ライボルトナイト','メガサメハダー':'サメハダナイト','メガバクーダ':'バクーダナイト',
  'メガチルタリス':'チルタリスナイト','メガジュペッタ':'ジュペッタナイト','メガアブソル':'アブソルナイト','メガオニゴーリ':'オニゴーリナイト',
  'メガボーマンダ':'ボーマンダナイト','メガメタグロス':'メタグロスナイト','メガラティアス':'ラティアスナイト','メガラティオス':'ラティオスナイト',
  'メガミミロップ':'ミミロップナイト','メガガブリアス':'ガブリアスナイト','メガルカリオ':'ルカリオナイト','メガユキノオー':'ユキノオナイト',
  'メガエルレイド':'エルレイドナイト','メガタブンネ':'タブンネナイト','メガディアンシー':'ディアンシナイト'
};
const MEGA_NAMES=new Set([...Object.keys(MEGA_STONES),...Object.keys(CUSTOM_POKEMON_FORMS).filter(n=>n.startsWith('メガ'))]);
function isMegaPokemon(name){return MEGA_NAMES.has(normalizePokemonName(name))}
function megaStoneFor(name){const n=normalizePokemonName(name);return MEGA_STONES[n]||(MEGA_NAMES.has(n)?'メガストーン':'')}
  function ensureSuggestionHost(input){let wrap=input.parentElement;if(!wrap.classList.contains('autocomplete-host')){const host=document.createElement('div');host.className='autocomplete-host';input.parentNode.insertBefore(host,input);host.appendChild(input);wrap=host}let box=wrap.querySelector(':scope > .autocomplete-list');if(!box){box=document.createElement('div');box.className='autocomplete-list';wrap.appendChild(box)}return box}
  function attachAutocomplete(input,type,onPick){
    if(!input||input.dataset.autocompleteBound)return;
    input.dataset.autocompleteBound='1';
    const box=ensureSuggestionHost(input);
    let suppress=false;
    const hide=()=>{box.classList.remove('show');box.innerHTML=''};
    const render=()=>{
      if(suppress)return;
      const vals=type==='pokemon'?pokemonCandidates(input.value):type==='item'?itemCandidates(input.value):moveCandidates(input.value);
      box.innerHTML=vals.map(v=>`<button type="button" class="autocomplete-option">${esc(v)}</button>`).join('');
      box.classList.toggle('show',vals.length>0);
      box.querySelectorAll('button').forEach((b,i)=>{
        const pick=e=>{
          e.preventDefault();e.stopPropagation();
          suppress=true;
          input.value=vals[i];
          hide();
          input.dispatchEvent(new Event('input',{bubbles:true}));
          input.dispatchEvent(new Event('change',{bubbles:true}));
          if(onPick)onPick(vals[i]);
          input.blur();
          setTimeout(()=>{suppress=false},80);
        };
        b.addEventListener('pointerdown',pick,{once:true});
      });
    };
    input.addEventListener('input',render);
    input.addEventListener('focus',render);
    input.addEventListener('blur',()=>setTimeout(hide,80));
    input.addEventListener('keydown',e=>{if(e.key==='Escape'){hide();input.blur()}});
  }
  const NATURES={
    'がんばりや':{},'さみしがり':{up:'A',down:'B'},'ゆうかん':{up:'A',down:'S'},'いじっぱり':{up:'A',down:'C'},'やんちゃ':{up:'A',down:'D'},
    'ずぶとい':{up:'B',down:'A'},'すなお':{},'のんき':{up:'B',down:'S'},'わんぱく':{up:'B',down:'C'},'のうてんき':{up:'B',down:'D'},
    'おくびょう':{up:'S',down:'A'},'せっかち':{up:'S',down:'B'},'まじめ':{},'ようき':{up:'S',down:'C'},'むじゃき':{up:'S',down:'D'},
    'ひかえめ':{up:'C',down:'A'},'おっとり':{up:'C',down:'B'},'れいせい':{up:'C',down:'S'},'てれや':{},'うっかりや':{up:'C',down:'D'},
    'おだやか':{up:'D',down:'A'},'おとなしい':{up:'D',down:'B'},'なまいき':{up:'D',down:'S'},'しんちょう':{up:'D',down:'C'},'きまぐれ':{}
  };
  const apiCache=new Map(), itemCache=new Map(), abilityCache=new Map();

  const $=s=>document.querySelector(s), uid=()=>crypto.randomUUID?.()||Date.now()+Math.random().toString(16).slice(2);
  const todayText=()=>{const d=new Date();return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`};
  function normalizeDateText(v){const m=String(v||'').trim().match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})$/);return m?`${m[1]}/${String(m[2]).padStart(2,'0')}/${String(m[3]).padStart(2,'0')}`:''}
  function dateSortValue(v){const n=normalizeDateText(v);return n?Number(n.replaceAll('/','')):0}
  let db, saveTimer, dragId=null, tagTargetId=null;

  function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>{db=r.result;resolve()};r.onerror=()=>reject(r.error)})}
  function dbGet(key){return new Promise((resolve,reject)=>{const r=db.transaction(STORE).objectStore(STORE).get(key);r.onsuccess=()=>{if(key==='data'){state.pokemonRelations=Array.isArray(r.result?.pokemonRelations)?r.result.pokemonRelations:[];state.savedMoves=Array.isArray(r.result?.savedMoves)?r.result.savedMoves:[];state.battleRecords=Array.isArray(r.result?.battleRecords)?r.result.battleRecords:[];state.damageHistory=Array.isArray(r.result?.damageHistory)?r.result.damageHistory:[]}resolve(r.result)};r.onerror=()=>reject(r.error)})}
  function dbSet(key,val){return new Promise((resolve,reject)=>{const r=db.transaction(STORE,'readwrite').objectStore(STORE).put(val,key);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
  function payload(){return {teams:state.teams,pairings:state.pairings,pokemonRelations:state.pokemonRelations,savedMoves:state.savedMoves,battleRecords:state.battleRecords,damageHistory:state.damageHistory,seasons:state.seasons,currentSeason:state.currentSeason,teamScope:state.teamScope,sortOrder:state.sortOrder,updatedAt:new Date().toISOString()}}
  function cloudPairingGroups(rows,legacy){return relationEntries(rows,legacy).map(row=>({names:row.names,memo:row.memo||''}))}
  function cloudPayload(){const data=payload();return {...data,pairings:state.pairings.map(p=>({...p,counterGroups:cloudPairingGroups(p.counterGroups,p.counterPokemon),complementGroups:cloudPairingGroups(p.complementGroups,p.complementPokemon),strongAgainstGroups:cloudPairingGroups(p.strongAgainstGroups,p.strongAgainstPokemon)})),pokemonRelations:state.pokemonRelations.map(r=>({...r,counterGroups:cloudPairingGroups(r.counterGroups,[]),complementGroups:cloudPairingGroups(r.complementGroups,[])}))}}
  function scheduleSave(){clearTimeout(saveTimer);saveTimer=setTimeout(async()=>{await dbSet('data',payload());setSyncText(cloud.user?'端末に保存・クラウド同期中':'この端末に保存');if(cloud.user)scheduleCloudSave();else toast('保存しました')},350)}
  function setSyncText(text){const el=$('#syncState');if(el)el.textContent=text}
  function scheduleCloudSave(){clearTimeout(cloudSaveTimer);cloudSaveTimer=setTimeout(saveCloud,800)}
  async function saveCloud(){if(!cloud.user||!cloud.db)return;if(cloud.saving){scheduleCloudSave();return}cloud.saving=true;setSyncText('クラウド同期中…');try{const {doc,setDoc,serverTimestamp}=cloud.api;await setDoc(doc(cloud.db,'users',cloud.user.uid,'apps','pokemon-team-manager'),{...cloudPayload(),updatedAt:serverTimestamp()},{merge:false});setSyncText('クラウド同期済み');toast('クラウドに保存しました')}catch(e){console.error(e);setSyncText('同期エラー');toast('クラウド同期に失敗しました')}finally{cloud.saving=false}}
  function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._tm);t._tm=setTimeout(()=>t.classList.remove('show'),1200)}
  const blankAdjustment=()=>({pokemon:'',nature:'',ability:'',item:'',moves:'',moveSlots:['','','',''],moveAlternatives:['','','',''],pokemonCandidate:'',pokemonCandidateMemo:'',iv:{H:31,A:31,B:31,C:31,D:31,S:31},ev:{H:0,A:0,B:0,C:0,D:0,S:0},memo:''});
  const blankTeam=()=>({id:uid(),user:'',owner:state.teamScope==='my'?'self':'other',rank:'',season:state.currentSeason==='all'?(state.seasons[0]||'未分類'):state.currentSeason,regulation:'',title:'',date:todayText(),tag:'none',updatedAt:new Date().toISOString(),pokemon:Array(6).fill(''),items:Array(6).fill(''),abilities:Array(6).fill(''),natures:Array(6).fill(''),pokemonChanges:[],moveChanges:[],adjustments:Array.from({length:6},blankAdjustment),favorableMatchups:[],unfavorableMatchups:[],favorablePairingIds:[],unfavorablePairingIds:[],relatedPairingIds:[],overallMemo:{lead:'先：\n後：',weak:'',improve:'',battle:'',free:''},partyView:'overview',isNewDraft:true});
  function teamHasUserInput(t){if(!t)return false;const basic=[t.user,t.rank,t.regulation,t.title,t.tag&&t.tag!=='none'?t.tag:''].some(v=>String(v||'').trim());const slots=[...(t.pokemon||[]),...(t.items||[]),...(t.abilities||[]),...(t.natures||[])].some(v=>String(v||'').trim());const notes=[String(t.overallMemo?.lead||'').replace(/先：|後：/g,''),t.overallMemo?.weak,t.overallMemo?.improve,t.overallMemo?.battle,t.overallMemo?.free].some(v=>String(v||'').trim());const adjustments=(t.adjustments||[]).some(a=>String(a?.memo||a?.moves||a?.pokemonCandidate||a?.pokemonCandidateMemo||'').trim()||(a?.moveSlots||[]).some(Boolean)||(a?.moveAlternatives||[]).some(Boolean)||Object.values(a?.ev||{}).some(Number));const links=['pokemonChanges','moveChanges','favorableMatchups','unfavorableMatchups','favorablePairingIds','unfavorablePairingIds','relatedPairingIds'].some(k=>(t[k]||[]).length);return basic||slots||notes||adjustments||links}
  function cleanupEmptyNewTeam(){const t=current();if(!t?.isNewDraft||teamHasUserInput(t))return false;state.teams=state.teams.filter(x=>x.id!==t.id);scheduleSave();return true}
  function normalizePokemonName(name){const n=String(name||'').trim().replace(/\s+/g,'').replace(/[・･]/g,'').replace(/（/g,'(').replace(/）/g,')').replace(/[Ｘｘ]/g,'X').replace(/[Ｙｙ]/g,'Y');if(/(?:ヒスイ)?イダイトウ(?:オス|♂)?$/.test(n))return 'イダイトウ♂';if(/(?:ヒスイ)?イダイトウ(?:メス|♀)$/.test(n))return 'イダイトウ♀';return n}

  function customPokemon(name){
    const raw=normalizePokemonName(name);if(!raw)return null;
    const compact=raw.replace(/[()]/g,'');
    return CUSTOM_POKEMON_FORMS[raw]||CUSTOM_POKEMON_FORMS[compact]||null;
  }
  function customImageUrl(meta){return meta?`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${meta.dex}-${meta.form}.png`:null}
  function pokemonApiKey(name){
    const raw=normalizePokemonName(name);if(!raw)return null;
    const formKey=raw.replace(/[()]/g,'');
    if(customPokemon(raw))return `custom:${raw}`;
    if(POKEMON_FORM_SLUGS[raw])return POKEMON_FORM_SLUGS[raw];
    if(POKEMON_FORM_SLUGS[formKey])return POKEMON_FORM_SLUGS[formKey];
    const dict=window.POKEMON_JA_TO_ID||{};
    if(dict[raw])return dict[raw];
    const base=raw.replace(/\(.+?\)$/,'');
    return dict[base]||null;
  }
  function imgFor(name){return placeholder(name)}
  const TYPE_JA={normal:'ノーマル',fire:'ほのお',water:'みず',electric:'でんき',grass:'くさ',ice:'こおり',fighting:'かくとう',poison:'どく',ground:'じめん',flying:'ひこう',psychic:'エスパー',bug:'むし',rock:'いわ',ghost:'ゴースト',dragon:'ドラゴン',dark:'あく',steel:'はがね',fairy:'フェアリー'};
  function typeId(typeEntry){
    const url=typeEntry?.type?.url||typeEntry?.url||'';
    const m=String(url).match(/\/type\/(\d+)\/?$/);
    return m?m[1]:'';
  }
  function typeIconUrl(typeEntry){
    const id=typeId(typeEntry);
    return id?`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/small/${id}.png`:'';
  }
  function renderTypeBadges(host,types=[]){
    if(!host)return;
    host.innerHTML=(types||[]).slice(0,2).map(x=>{
      const key=x?.type?.name||x?.name||'';
      const src=typeIconUrl(x);
      return src?`<img class="type-icon" src="${esc(src)}" alt="${esc(TYPE_JA[key]||key||'タイプ')}" title="${esc(TYPE_JA[key]||key||'タイプ')}">`:'';
    }).join('');
  }
  async function pokemonData(name){
    const meta=customPokemon(name);
    if(meta){
      const cacheKey=`custom:${normalizePokemonName(name)}`;
      if(apiCache.has(cacheKey))return apiCache.get(cacheKey);
      let base=null;
      try{const r=await fetch(`https://pokeapi.co/api/v2/pokemon/${meta.base}`);if(r.ok)base=await r.json()}catch(e){console.warn('custom base fetch failed',name,e)}
      const statNames=['hp','attack','defense','special-attack','special-defense','speed'];
      const stats=(meta.stats||[]).length===6?meta.stats.map((v,i)=>({base_stat:v,effort:0,stat:{name:statNames[i]}})):(base?.stats||[]);
      const abilities=meta.ability?[{is_hidden:false,slot:1,ability:{name:meta.ability,url:''}}]:(base?.abilities||[]);
      const d={...(base||{}),name:normalizePokemonName(name),stats,abilities,sprites:{...(base?.sprites||{}),other:{...(base?.sprites?.other||{}),'official-artwork':{front_default:customImageUrl(meta)}}},_custom:true,_customAbility:meta.ability||''};
      apiCache.set(cacheKey,d);return d;
    }
    const key=pokemonApiKey(name);if(!key||String(key).startsWith('custom:'))return null;
    if(apiCache.has(String(key)))return apiCache.get(String(key));
    try{const r=await fetch(`https://pokeapi.co/api/v2/pokemon/${key}`);if(!r.ok)throw Error(r.status);const d=await r.json();apiCache.set(String(key),d);return d}catch(e){console.warn('pokemon fetch failed',name,key,e);return null}
  }
  async function hydrateImages(root=document){
    const imgs=[...root.querySelectorAll('img[data-pokemon]')];
    await Promise.all(imgs.map(async img=>{const name=(img.dataset.pokemon||'').trim();img.src=placeholder(name);const d=await pokemonData(name);const src=d?.sprites?.other?.['official-artwork']?.front_default||d?.sprites?.front_default;if(src)img.src=src;const wrap=img.parentElement;const host=wrap?.querySelector('.type-badges');if(host)renderTypeBadges(host,d?.types||[])}));
    const items=[...root.querySelectorAll('img[data-item]')];
    await Promise.all(items.map(async img=>{const name=(img.dataset.item||'').trim();img.src=transparentPixel();const src=await itemImage(name);if(src)img.src=src}));
  }
  function itemSlug(name){const raw=String(name||'').trim();if(!raw)return null;return ITEM_SLUGS[raw]||raw.toLowerCase().replace(/\s+/g,'-')}
  async function itemImage(name){const slug=itemSlug(name);if(!slug)return null;if(slug==='fairy-feather')return 'https://www.serebii.net/itemdex/sprites/fairyfeather.png';if(itemCache.has(slug))return itemCache.get(slug);const direct=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${slug}.png`;itemCache.set(slug,direct);return direct}
  async function abilityNamesForPokemon(name){
    const key=normalizePokemonName(name);if(!key)return [];
    if(abilityCache.has(key))return abilityCache.get(key);
    const d=await pokemonData(name);if(!d)return [];
    if(d._customAbility){const out=[d._customAbility];abilityCache.set(key,out);return out}
    const names=[];
    await Promise.all((d.abilities||[]).map(async a=>{try{const r=await fetch(a.ability.url);if(!r.ok)throw Error(r.status);const ad=await r.json();const ja=(ad.names||[]).find(x=>x.language.name==='ja-Hrkt')||(ad.names||[]).find(x=>x.language.name==='ja');names.push(ja?.name||a.ability.name)}catch{names.push(a.ability.name)}}));
    const out=[...new Set(names)];abilityCache.set(key,out);return out;
  }
  function attachAbilityAutocomplete(input,getPokemonName){
    if(!input||input.dataset.autocompleteBound)return;
    input.dataset.autocompleteBound='1';
    const box=ensureSuggestionHost(input);let token=0,suppress=false;
    const hide=()=>{box.classList.remove('show');box.innerHTML=''};
    const render=async()=>{if(suppress)return;const my=++token,q=searchNorm(input.value),all=await abilityNamesForPokemon(getPokemonName());if(my!==token||suppress)return;const vals=all.filter(n=>!q||searchNorm(n).includes(q)).sort((a,b)=>Number(searchNorm(b).startsWith(q))-Number(searchNorm(a).startsWith(q))||a.localeCompare(b,'ja'));box.innerHTML=vals.map(v=>`<button type="button" class="autocomplete-option">${esc(v)}</button>`).join('');box.classList.toggle('show',vals.length>0);box.querySelectorAll('button').forEach((b,i)=>b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();suppress=true;input.value=vals[i];hide();input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));input.blur();setTimeout(()=>{suppress=false},80)},{once:true}))};
    input.addEventListener('input',render);input.addEventListener('focus',render);input.addEventListener('blur',()=>setTimeout(hide,80));input.addEventListener('keydown',e=>{if(e.key==='Escape'){hide();input.blur()}})
  }
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

  function renderSortControl(){const el=$('#sortOrderSelect');if(!el)return;el.value=state.sortOrder||'manual';el.onchange=()=>{state.sortOrder=el.value;scheduleSave();renderList()}}

  function renderFilters(){const defs=[['all','すべて'],['red','🔴 注目'],['blue','🔵 試用'],['green','🟢 上位'],['purple','🟣 要研究']];$('#filters').innerHTML=defs.map(([k,l])=>`<button class="btn small filter ${state.filter===k?'active':''}" data-filter="${k}">${l}</button>`).join('');document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;renderList();renderFilters()})}
  function filtered(){
    const q=state.query.trim().toLowerCase();
    const rows=state.teams.filter(t=>(state.someoneTeamsOnly?String(t.user||'').trim()==='なし':((state.teamScope==='my'?(t.owner==='self'):(t.owner!=='self'))&&String(t.user||'').trim()!=='なし'))&&(state.currentSeason==='all'||(t.season||'未分類')===state.currentSeason)&&(state.filter==='all'||t.tag===state.filter)&&(!q||[t.date,t.user,t.rank,t.title,t.season,...t.pokemon].join(' ').toLowerCase().includes(q)));
    if(state.sortOrder==='newest')rows.sort((a,b)=>dateSortValue(b.date)-dateSortValue(a.date)||String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')));
    if(state.sortOrder==='oldest')rows.sort((a,b)=>dateSortValue(a.date)-dateSortValue(b.date)||String(a.updatedAt||'').localeCompare(String(b.updatedAt||'')));
    if(state.sortOrder==='user')rows.sort((a,b)=>String(a.user||'').localeCompare(String(b.user||''),'ja'));
    if(state.sortOrder==='rank')rows.sort((a,b)=>{const na=Number(String(a.rank||'').match(/\d+/)?.[0]||999999),nb=Number(String(b.rank||'').match(/\d+/)?.[0]||999999);return na-nb});
    return rows;
  }
  function renderList(){const list=filtered();const scoped=state.teams.filter(t=>state.someoneTeamsOnly?String(t.user||'').trim()==='なし':(state.teamScope==='my'?t.owner==='self':t.owner!=='self')&&(state.currentSeason==='all'||(t.season||'未分類')===state.currentSeason));$('#counts').textContent=`${state.someoneTeamsOnly?'誰かの構築':state.teamScope==='my'?'My Team':'World Team'} ／ ${state.currentSeason==='all'?'全シーズン':state.currentSeason}：全${scoped.length}件 ／ 表示${list.length}件　${Object.entries(TAGS).slice(1).map(([k,v])=>`${v.emoji}${state.teams.filter(t=>t.tag===k).length}`).join(' ')}`;$('#someoneTeamsBtn')?.classList.toggle('active',state.someoneTeamsOnly);$('#teamList').innerHTML=list.length?list.map(teamRowHTML).join(''):'<div class="empty">構築がありません。</div>';hydrateImages($('#teamList'));bindRows()}
  function teamRowHTML(t){return `<article class="team-row" data-id="${t.id}" data-tag="${t.tag}">
    <div class="team-meta">
      <div class="field"><label>使用者</label><input data-k="user" value="${esc(t.user)}" placeholder="使用者"></div>
      <div class="field"><label>順位</label><input data-k="rank" value="${esc(t.rank)}" placeholder="最終○位"></div>
    </div>
    <div class="party">${t.pokemon.map((n,i)=>`<div class="mon"><div class="mon-image-wrap"><img data-pokemon="${esc(n)}" src="${imgFor(n)}"><div class="type-badges" data-type-for="${esc(n)}"></div><img class="held-item-icon" data-item="${esc((t.items||[])[i]||'')}" alt=""></div><div class="mon-name">${esc(n||'未登録')}</div></div>`).join('')}</div>
    <div class="row-actions"><span class="team-date">${esc(t.date||'日付未登録')}</span><button class="btn small detail-btn" title="詳細を開く">詳細</button><button class="tag-btn" title="タグ">${TAGS[t.tag||'none'].emoji}</button><button class="btn drag-handle" title="長押しして並べ替え">≡</button></div>
  </article>`}
  function bindRows(){document.querySelectorAll('.team-row').forEach(row=>{const id=row.dataset.id;row.querySelectorAll('[data-k]').forEach(inp=>inp.oninput=()=>setTeam(id,{[inp.dataset.k]:inp.value}));row.querySelector('.detail-btn').onclick=()=>openDetail(id);row.querySelector('.tag-btn').onclick=()=>openTag(id);const h=row.querySelector('.drag-handle');h.onpointerdown=e=>startDrag(e,id,row);});}
  function startDrag(e,id,row){e.preventDefault();dragId=id;row.classList.add('dragging');row.setPointerCapture(e.pointerId);const move=ev=>{const el=document.elementFromPoint(ev.clientX,ev.clientY)?.closest('.team-row');if(!el||el===row)return;const from=state.teams.findIndex(t=>t.id===dragId),to=state.teams.findIndex(t=>t.id===el.dataset.id);if(from<0||to<0)return;const [item]=state.teams.splice(from,1);state.teams.splice(to,0,item);renderList();const newRow=document.querySelector(`.team-row[data-id="${dragId}"]`);newRow?.classList.add('dragging')};const up=()=>{dragId=null;document.querySelectorAll('.team-row').forEach(r=>r.classList.remove('dragging'));scheduleSave();document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',up)};document.addEventListener('pointermove',move);document.addEventListener('pointerup',up,{once:true})}
  function openTag(id){tagTargetId=id;$('#tagOptions').innerHTML=Object.entries(TAGS).map(([k,v])=>`<button class="tag-option" data-tag-choice="${k}"><span class="dot" style="background:${v.color}"></span><strong>${v.emoji} ${v.label}</strong></button>`).join('');document.querySelectorAll('[data-tag-choice]').forEach(b=>b.onclick=()=>{setTeam(tagTargetId,{tag:b.dataset.tagChoice});$('#tagModal').classList.remove('show');renderList()});$('#tagModal').classList.add('show')}

  function openDetail(id,returnContext=null){state.currentId=id;state.detailReturn=returnContext;showOnlyView('detailView');$('#backBtn').textContent=returnContext?.type==='pokemon'?`← ${returnContext.name}の一覧`:'← 一覧';renderDetail();scrollTo(0,0)}
  function current(){return state.teams.find(t=>t.id===state.currentId)}
  function ensureTeamAdjustments(t){t.items=Array.from({length:6},(_,i)=>(t.items||[])[i]||'');t.abilities=Array.from({length:6},(_,i)=>(t.abilities||[])[i]||'');t.natures=Array.from({length:6},(_,i)=>(t.natures||[])[i]||'');t.adjustments=Array.from({length:6},(_,i)=>{const a=(t.adjustments||[])[i]||blankAdjustment();a.pokemon=t.pokemon[i]||'';a.item=t.items[i]||'';a.ability=t.abilities[i]||'';a.nature=t.natures[i]||'';a.iv={H:31,A:31,B:31,C:31,D:31,S:31,...(a.iv||{})};a.ev={H:0,A:0,B:0,C:0,D:0,S:0,...(a.ev||{})};for(const k of ['H','A','B','C','D','S'])a.ev[k]=legacyEVToPoint(a.ev[k]);a.ev=sanitizeEffortObject(a.ev);a.moveSlots=Array.from({length:4},(_,j)=>(a.moveSlots||splitMoves(a.moves))[j]||'');a.moveAlternatives=Array.from({length:4},(_,j)=>(a.moveAlternatives||[])[j]||'');if(!a.pokemonCandidate){const pc=(t.pokemonChanges||[]).find(x=>normalizePokemonName(x.from)===normalizePokemonName(a.pokemon));if(pc){a.pokemonCandidate=pc.to||'';a.pokemonCandidateMemo=pc.reason||''}}for(const mc of (t.moveChanges||[]).filter(x=>normalizePokemonName(x.pokemon)===normalizePokemonName(a.pokemon))){const j=a.moveSlots.findIndex(x=>normalizePokemonName(x)===normalizePokemonName(mc.fromMove));if(j>=0&&!a.moveAlternatives[j])a.moveAlternatives[j]=mc.toMove||''}return a})}
  function renderDetail(){const t=current();if(!t)return;ensureTeamAdjustments(t);$('#detailTitle').textContent=t.title||'構築詳細';$('#detailContent').innerHTML=`
    <div class="section"><h3>基本情報</h3><div class="detail-grid">
      <div class="quick-input"><div class="field"><label>基本情報まとめ入力</label><textarea id="basicQuickInput" class="quick-summary-textarea" rows="1" wrap="off" placeholder="使用者 / 順位 / ポケモン1 / ポケモン2 / …"></textarea></div><small>1つ目を使用者、2つ目を順位、3つ目以降をパーティへ反映します。日付は新規作成時に自動入力され、ここからは変更されません。</small></div>
      ${field('使用者','user',t.user)}${ownerField(t.owner)}${field('順位','rank',t.rank)}${seasonField(t.season)}
      ${field('構築名','title',t.title)}${field('日付','date',t.date||todayText(),'date')}
    </div></div>
    <div class="section party-section"><div class="section-title-row"><h3>パーティ</h3><div class="party-view-toggle"><button type="button" class="btn small ${t.partyView!=='edit'?'primary':''}" data-party-view="overview">一覧</button><button type="button" class="btn small ${t.partyView==='edit'?'primary':''}" data-party-view="edit">編集</button></div></div><div class="quick-input" style="margin-bottom:10px"><div class="field"><label>6体まとめて入力</label><input id="partyQuickInput" value="${esc(t.pokemon.filter(Boolean).join(' / '))}" placeholder="カイリュー / サーフゴー / …　または　カイリュー、サーフゴー、…"></div><small>「/」または「、」で区切ると6枠へ自動反映します。</small></div><div class="editor-party ${t.partyView==='edit'?'edit-mode':'overview-mode'}">${t.pokemon.map((n,i)=>t.partyView==='edit'?editorMon(t,i):partyOverviewMon(t,i)).join('')}</div></div>
    <div class="section party-memo-section"><h3>構築メモ</h3><div class="detail-grid">
      ${area('基本選出','lead',t.overallMemo.lead||'先：\n後：')}${area('苦手な相手','weak',t.overallMemo.weak)}${area('改善点','improve',t.overallMemo.improve)}${area('対戦メモ','battle',t.overallMemo.battle)}${area('自由メモ','free',t.overallMemo.free)}
    </div></div>
    <div class="section"><div class="section-title-row"><h3>ポケモンごとの調整・変更候補</h3><div class="adjustment-toggle-actions"><button type="button" class="btn small" id="openAllAdjustments">＋すべて開く</button><button type="button" class="btn small" id="closeAllAdjustments">－すべて閉じる</button></div></div><p class="sub">上の6体と自動連動します。必要なポケモンだけ開いて編集できます。</p><div class="cards">${t.adjustments.map((x,i)=>adjustmentCard(x,i)).join('')}</div></div>
    ${pairingLinkSection(t,'favorablePairingIds','有利な並び','favorable')}
    ${pairingLinkSection(t,'unfavorablePairingIds','不利な並び','unfavorable')}
    ${pairingLinkSection(t,'relatedPairingIds','この構築と関連する並び','related')}
    ${battleDataSection(t)}
    `;
    bindDetail();
  }
  function field(label,key,val,type='text'){return `<div class="field"><label>${label}</label><input type="${type}" data-basic="${key}" value="${esc(type==='date'?String(val||'').replaceAll('/','-'):val)}"></div>`}
  function ownerField(val){return `<div class="field"><label>登録区分</label><select data-basic="owner"><option value="other" ${val!=='self'?'selected':''}>自分以外（World Team）</option><option value="self" ${val==='self'?'selected':''}>自分（My Team）</option></select></div>`}
  function seasonField(val){return `<div class="field"><label>シーズン</label><select data-basic="season">${state.seasons.map(x=>`<option ${x===val?'selected':''}>${esc(x)}</option>`).join('')}</select></div>`}
  function splitInput(v){return String(v||'').split(/\s*(?:\/|、)\s*/).map(x=>x.trim()).filter(Boolean)}
  function area(label,key,val){return `<div class="field"><label>${label}</label><textarea class="auto-grow" data-overall="${key}">${esc(val)}</textarea></div>`}
  function editorMon(t,i){const name=t.pokemon[i]||'',item=t.items[i]||'',ability=t.abilities[i]||'',nature=t.natures[i]||'';return `<div class="editor-mon" data-party-card="${i}"><div class="editor-image-wrap"><img data-pokemon="${esc(name)}" src="${imgFor(name)}"><div class="type-badges" data-type-for="${esc(name)}"></div><img class="held-item-icon large" data-item="${esc(item)}" alt=""></div><input data-poke-index="${i}" value="${esc(name)}" placeholder="ポケモン名"><input data-item-index="${i}" value="${esc(item)}" placeholder="持ち物"><input data-ability-index="${i}" value="${esc(ability)}" placeholder="特性"><select class="nature-select ${natureClass(nature)}" data-nature-index="${i}">${natureOptions(nature)}</select><div class="party-stat-summary" data-party-stat="${i}">調整後：H－, A－, B－, C－, D－, S－</div><div class="party-effort-summary" data-party-effort="${i}">振り方：H0, A0, B0, C0, D0, S0</div></div>`}
  function partyOverviewMon(t,i){const name=t.pokemon[i]||'',item=t.items[i]||'',ability=t.abilities[i]||'',nature=t.natures[i]||'';return `<article class="party-overview-mon" data-party-card="${i}"><div class="overview-image-wrap"><img data-pokemon="${esc(name)}" src="${imgFor(name)}"><div class="type-badges" data-type-for="${esc(name)}"></div><img class="held-item-icon large" data-item="${esc(item)}" alt=""></div><div class="overview-info-row"><strong class="overview-name" title="${esc(name)}">${esc(name||'未登録')}</strong><span class="overview-ability" title="${esc(ability)}">${esc(ability||'特性未登録')}</span><span class="overview-item" title="${esc(item)}"><img data-item="${esc(item)}" alt="">${esc(item||'持ち物未登録')}</span></div><div class="overview-nature ${natureClass(nature)}">${esc(natureLabel(nature)||'性格未登録')}</div><div class="party-stat-summary compact before" data-party-base-stat="${i}">調整前：H－ A－ B－ C－ D－ S－</div><div class="party-stat-summary compact after" data-party-stat="${i}">調整後：H－ A－ B－ C－ D－ S－</div></article>`}
  function cardsSection(title,key,items,renderer,button){return `<div class="section"><h3>${title}</h3><div class="cards">${items.map((x,i)=>renderer(x,i)).join('')}</div><button class="btn primary" data-add-card="${key}" style="margin-top:10px">${button}</button></div>`}
  function pokemonChangeCard(x,i){return `<div class="memo-card" data-card="pokemonChanges" data-index="${i}"><div class="card-grid">
    <div class="field"><label>現在のポケモン</label><input data-c="from" value="${esc(x.from||'')}"><div class="preview"><img data-preview="from" data-pokemon="${esc(x.from||'')}" src="${imgFor(x.from)}"></div></div><div class="arrow">→</div>
    <div class="field"><label>変更候補</label><input data-c="to" value="${esc(x.to||'')}"><div class="preview"><img data-preview="to" data-pokemon="${esc(x.to||'')}" src="${imgFor(x.to)}"></div></div></div>
    <div class="field"><label>理由・使用感</label><textarea class="auto-grow" data-c="reason">${esc(x.reason||'')}</textarea></div><div class="status-row"><select data-c="status"><option>未検証</option><option>試用中</option><option>採用</option><option>不採用</option></select><button class="btn danger delete-card">削除</button></div></div>`}
  function moveChangeCard(x,i){return `<div class="memo-card" data-card="moveChanges" data-index="${i}"><div class="card-grid">
    <div class="field"><label>ポケモン</label><input data-c="pokemon" value="${esc(x.pokemon||'')}"><div class="preview"><img data-preview="pokemon" data-pokemon="${esc(x.pokemon||'')}" src="${imgFor(x.pokemon)}"></div></div><div class="arrow">→</div>
    <div><div class="field"><label>現在の技</label><input data-c="fromMove" value="${esc(x.fromMove||'')}"></div><div class="field"><label>代替技候補</label><input data-c="toMove" value="${esc(x.toMove||'')}"></div></div></div>
    <div class="field"><label>理由・使用感</label><textarea class="auto-grow" data-c="reason">${esc(x.reason||'')}</textarea></div><div class="status-row"><select data-c="status"><option>未検証</option><option>試用中</option><option>採用</option><option>不採用</option></select><button class="btn danger delete-card">削除</button></div></div>`}
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
  function effortRemaining(ev){return Math.max(0,66-effortTotal(ev))}
  function sanitizeEffortObject(ev){const out={H:0,A:0,B:0,C:0,D:0,S:0};let left=66;for(const k of ['H','A','B','C','D','S']){const v=Math.min(32,left,clampNum(ev?.[k]??0,0,32));out[k]=v;left-=v}return out}

  function adjustmentHistoryEntries(pokemon,currentTeamId,currentIndex){
    const target=normalizePokemonName(pokemon), seen=new Set(), rows=[];
    if(!target)return rows;
    state.teams.forEach(team=>{
      ensureTeamAdjustments(team);
      (team.pokemon||[]).forEach((name,index)=>{
        if(normalizePokemonName(name)!==target)return;
        if(team.id===currentTeamId&&index===currentIndex)return;
        const a=team.adjustments?.[index]||blankAdjustment();
        const signature=JSON.stringify({item:a.item||'',ability:a.ability||'',nature:a.nature||'',iv:a.iv||{},ev:a.ev||{},moveSlots:a.moveSlots||splitMoves(a.moves),memo:a.memo||''});
        if(seen.has(signature))return;seen.add(signature);
        rows.push({team,index,adjustment:a,updatedAt:team.updatedAt||''});
      });
    });
    return rows.sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt))).slice(0,40);
  }
  function adjustmentHistoryOptions(pokemon,currentIndex){
    const team=current(), rows=adjustmentHistoryEntries(pokemon,team?.id,currentIndex);
    if(!rows.length)return '<option value="">過去の登録はありません</option>';
    return '<option value="">過去の登録から型を選択</option>'+rows.map(r=>{
      const a=r.adjustment, moves=(a.moveSlots||splitMoves(a.moves)).filter(Boolean).join('・')||'技未登録';
      const label=[r.team.date||'',r.team.user||'使用者未登録',a.item||'持ち物なし',natureLabel(a.nature||'')||'性格未登録',moves].filter(Boolean).join(' / ');
      return `<option value="${esc(r.team.id)}:${r.index}">${esc(label)}</option>`;
    }).join('');
  }
  function copyAdjustmentFromHistory(target,source,pokemon){
    const copied=JSON.parse(JSON.stringify(source||blankAdjustment()));
    Object.assign(target,copied,{pokemon});
    target.iv={H:31,A:31,B:31,C:31,D:31,S:31,...(copied.iv||{})};
    target.ev=sanitizeEffortObject(copied.ev||{});
    target.moveSlots=Array.from({length:4},(_,i)=>(copied.moveSlots||splitMoves(copied.moves))[i]||'');
    target.moveAlternatives=Array.from({length:4},(_,i)=>(copied.moveAlternatives||[])[i]||'');
    target.moves=target.moveSlots.filter(Boolean).join(' / ');
  }

  function adjustmentCard(x,i){const ev=x.ev||{},iv=x.iv||{},remaining=effortRemaining(ev);return `<details class="memo-card adjustment-card" data-card="adjustments" data-index="${i}"><summary class="adjustment-summary"><div class="adjustment-identity"><div class="editor-image-wrap compact-mon"><img data-pokemon="${esc(x.pokemon||'')}" src="${imgFor(x.pokemon)}"><div class="type-badges compact-types" data-type-for="${esc(x.pokemon||'')}"></div><img class="held-item-icon large" data-item="${esc(x.item||'')}" alt=""></div><div><strong>${i+1}体目：${esc(x.pokemon||'未登録')}</strong><div class="sub">${esc(x.item||'持ち物未登録')} / ${esc(x.ability||'特性未登録')} / ${esc(natureLabel(x.nature||''))}</div></div></div></summary><div class="adjustment-body"><div class="history-picker"><label>過去に登録した同じポケモンの型</label><button type="button" class="btn history-open-btn" data-open-history ${adjustmentHistoryEntries(x.pokemon,current()?.id,i).length?'':'disabled'}>${adjustmentHistoryEntries(x.pokemon,current()?.id,i).length?`一覧から選ぶ（${adjustmentHistoryEntries(x.pokemon,current()?.id,i).length}件）`:'過去の登録はありません'}</button><small>ボタンを押すと、このポケモンの登録済みの型を一覧表示します。選択すると自動でこの構築へ戻ります。</small></div><div class="adjust-grid">
    <div class="field"><label>ポケモン</label><input data-c="pokemon" value="${esc(x.pokemon||'')}" disabled></div><div class="field"><label>性格</label><select class="nature-select ${natureClass(x.nature||'')}" data-c="nature">${natureOptions(x.nature||'')}</select></div><div class="field"><label>特性</label><input data-c="ability" value="${esc(x.ability||'')}" placeholder="特性"></div><div class="field"><label>持ち物</label><input data-c="item" value="${esc(x.item||'')}" placeholder="持ち物"></div></div>
    <div class="move-slots"><strong>技構成・代替候補</strong>${[0,1,2,3].map(j=>`<div class="move-slot-row"><div class="field"><label>技${j+1}</label><input data-move-slot="${j}" value="${esc((x.moveSlots||[])[j]||'')}" placeholder="技${j+1}"></div><div class="move-arrow">→</div><div class="field"><label>代替候補</label><input data-move-alt="${j}" value="${esc((x.moveAlternatives||[])[j]||'')}" placeholder="変更候補"></div></div>`).join('')}</div>
    <div class="stat-entry"><strong>Lv50実数値計算</strong><small>個体値は0〜31。努力値ポイントは各能力0〜32、6能力の合計は最大66です。性格補正は上昇1.1倍・下降0.9倍です。</small>
      <div class="effort-remaining table-remaining" data-ev-remaining>残り ${remaining} / 66</div>
      <div class="stat-table stat-head"><span></span>${['H','A','B','C','D','S'].map(k=>`<b>${k}</b>`).join('')}</div>
      <div class="stat-table"><span>個体値</span>${['H','A','B','C','D','S'].map(k=>`<input type="number" min="0" max="31" data-iv="${k}" value="${esc(iv[k]??31)}">`).join('')}</div>
      <div class="stat-table"><span>努力値</span>${['H','A','B','C','D','S'].map(k=>`<input type="number" min="0" max="32" step="1" data-ev="${k}" value="${esc(ev[k]??0)}">`).join('')}</div>
      <div class="stat-table calculated"><span>実数値</span>${['H','A','B','C','D','S'].map(k=>`<output data-stat-output="${k}">－</output>`).join('')}</div>
      <div class="stat-note" data-stat-note>種族値を取得して計算します。</div>
    </div><div class="field"><label>調整意図・使用感</label><textarea class="auto-grow" data-c="memo">${esc(x.memo||'')}</textarea></div>
    <div class="candidate-block"><h4>変更候補</h4><div class="field"><label>変更候補ポケモン</label><input data-c="pokemonCandidate" value="${esc(x.pokemonCandidate||'')}" placeholder="候補ポケモン"></div><div class="field"><label>ポケモン変更候補の理由・使用感</label><textarea class="auto-grow" data-c="pokemonCandidateMemo">${esc(x.pokemonCandidateMemo||'')}</textarea></div></div></div></details>`}
  function matchupCard(x,i){const key=x._key||'';const mons=Array.isArray(x.pokemon)?x.pokemon:Array(6).fill('');const cls=key==='favorableMatchups'?'advantage':'disadvantage';const linked=state.teams.find(t=>t.id===x.linkedTeamId);return `<div class="memo-card ${cls}" data-card="${key}" data-index="${i}">
    <div class="matchup-search"><div class="field"><label>登録済み構築から検索して選択</label><input data-match-search placeholder="使用者・順位・構築名・ポケモン名で検索"><div class="matchup-results"></div></div></div>
    <div class="linked-note">${linked?`リンク元：${esc(linked.user||'使用者未登録')} / ${esc(linked.rank||'順位未登録')} / ${esc(linked.title||'構築名未登録')}`:'既存構築を選ばず、下の欄へ1〜6体だけ直接入力することもできます。'}</div>
    <div class="matchup-head"><div class="field"><label>相手構築名・軸</label><input data-c="title" value="${esc(x.title||'')}" placeholder="例：受けループ／雨パ"></div><div class="field"><label>使用者・順位・出典</label><input data-c="source" value="${esc(x.source||'')}" placeholder="例：○○ / 最終50位"></div></div>
    <div class="matchup-party">${mons.map((n,j)=>`<div class="matchup-mon"><img data-match-preview="${j}" data-pokemon="${esc(n)}" src="${imgFor(n)}"><input data-match-poke="${j}" value="${esc(n)}" placeholder="ポケモン名"></div>`).join('')}</div>
    <div class="field"><label>${key==='favorableMatchups'?'有利な理由・基本の勝ち筋':'不利な理由・注意点'}</label><textarea class="auto-grow" data-c="reason">${esc(x.reason||'')}</textarea></div><div class="field"><label>選出・立ち回りメモ</label><textarea class="auto-grow" data-c="plan">${esc(x.plan||'')}</textarea></div><div class="status-row"><button class="btn small" data-clear-link>既存構築とのリンクを解除</button><button class="btn danger delete-card">削除</button></div></div>`}
  function matchupSearchResults(query){const q=(query||'').trim().toLowerCase();if(!q)return [];return state.teams.filter(t=>t.id!==state.currentId&&[t.user,t.rank,t.title,t.season,t.regulation,...(t.pokemon||[])].join(' ').toLowerCase().includes(q)).slice(0,12)}
  function applyTeamToMatchup(item,team){item.linkedTeamId=team.id;item.title=team.title||'';item.source=[team.user,team.rank].filter(Boolean).join(' / ');item.pokemon=Array.from({length:6},(_,i)=>(team.pokemon||[])[i]||'');item.sourceSeason=team.season||''}


  function bindDetail(){const t=current();hydrateImages($('#detailContent'));document.querySelectorAll('[data-select-pairings]').forEach(b=>b.onclick=()=>openPairingList(b.dataset.selectPairings,t.id));document.querySelectorAll('[data-open-pairing]').forEach(b=>b.onclick=()=>openPairingEditor(b.dataset.openPairing));document.querySelectorAll('[data-party-view]').forEach(b=>b.onclick=()=>{t.partyView=b.dataset.partyView;t.updatedAt=new Date().toISOString();scheduleSave();renderDetail()});const openAll=$('#openAllAdjustments'),closeAll=$('#closeAllAdjustments');if(openAll)openAll.onclick=()=>document.querySelectorAll('.adjustment-card').forEach(d=>d.open=true);if(closeAll)closeAll.onclick=()=>document.querySelectorAll('.adjustment-card').forEach(d=>d.open=false);document.querySelectorAll('textarea.auto-grow, textarea[data-overall], .memo-card textarea').forEach(enableAutoGrow);const bq=$('#basicQuickInput');if(bq)bq.onchange=()=>{const a=splitInput(bq.value);if(a[0]!=null)t.user=a[0];if(a[1]!=null)t.rank=a[1];const mons=a.slice(2,8);if(mons.length){t.pokemon=Array.from({length:6},(_,i)=>mons[i]||t.pokemon?.[i]||'');ensureTeamAdjustments(t)}if(!t.date)t.date=todayText();t.updatedAt=new Date().toISOString();scheduleSave();renderDetail()};const pq=$('#partyQuickInput');if(pq)pq.onchange=()=>{const a=splitInput(pq.value).slice(0,6);t.pokemon=Array.from({length:6},(_,i)=>a[i]||'');t.updatedAt=new Date().toISOString();scheduleSave();renderDetail()};document.querySelectorAll('[data-basic]').forEach(el=>el.oninput=()=>{const value=el.dataset.basic==='date'?String(el.value||'').replaceAll('-','/'):el.value;setTeam(t.id,{[el.dataset.basic]:value});if(el.dataset.basic==='title')$('#detailTitle').textContent=el.value||'構築詳細'});document.querySelectorAll('[data-overall]').forEach(el=>el.oninput=()=>{t.overallMemo[el.dataset.overall]=el.value;t.updatedAt=new Date().toISOString();scheduleSave()});document.querySelectorAll('[data-poke-index]').forEach(el=>{el.onchange=()=>{const i=+el.dataset.pokeIndex;t.pokemon[i]=el.value.trim();if(isMegaPokemon(t.pokemon[i]))t.items[i]=megaStoneFor(t.pokemon[i]);ensureTeamAdjustments(t);t.updatedAt=new Date().toISOString();scheduleSave();renderDetail()};attachAutocomplete(el,'pokemon')});document.querySelectorAll('[data-item-index]').forEach(el=>{const i=+el.dataset.itemIndex;if(isMegaPokemon(t.pokemon[i])){el.value=megaStoneFor(t.pokemon[i]);el.disabled=true;el.title='メガシンカのため持ち物は専用メガストーン固定です'}el.onchange=()=>{t.items[i]=isMegaPokemon(t.pokemon[i])?megaStoneFor(t.pokemon[i]):el.value.trim();ensureTeamAdjustments(t);t.updatedAt=new Date().toISOString();scheduleSave();renderDetail()};attachAutocomplete(el,'item')});document.querySelectorAll('[data-ability-index]').forEach(el=>{const i=+el.dataset.abilityIndex;el.onchange=()=>{t.abilities[i]=el.value.trim();ensureTeamAdjustments(t);scheduleSave();renderDetail()};attachAbilityAutocomplete(el,()=>t.pokemon[i])});document.querySelectorAll('[data-nature-index]').forEach(el=>{const i=+el.dataset.natureIndex;el.value=t.natures[i]||'';el.onchange=()=>{t.natures[i]=el.value;ensureTeamAdjustments(t);scheduleSave();renderDetail()}});
    document.querySelectorAll('[data-add-card]').forEach(b=>b.onclick=()=>{const k=b.dataset.addCard;if(k==='pokemonChanges')t[k].push({from:'',to:'',reason:'',status:'未検証'});if(k==='moveChanges')t[k].push({pokemon:'',fromMove:'',toMove:'',reason:'',status:'未検証'});if(k==='favorableMatchups'||k==='unfavorableMatchups')t[k].push({_key:k,linkedTeamId:'',title:'',source:'',pokemon:Array(6).fill(''),reason:'',plan:''});scheduleSave();renderDetail()});
    document.querySelectorAll('.memo-card').forEach(card=>{const key=card.dataset.card,idx=+card.dataset.index,item=t[key][idx];card.querySelectorAll('[data-c]').forEach(el=>{if(el.tagName==='SELECT')el.value=item[el.dataset.c]||'未検証';el.oninput=()=>{item[el.dataset.c]=el.value;t.updatedAt=new Date().toISOString();scheduleSave();const p=card.querySelector(`[data-preview="${el.dataset.c}"]`);if(p){p.dataset.pokemon=el.value;p.src=imgFor(el.value);hydrateImages(card)}if(key==='adjustments'){if(el.dataset.c==='item')t.items[idx]=isMegaPokemon(t.pokemon[idx])?megaStoneFor(t.pokemon[idx]):el.value;if(el.dataset.c==='ability')t.abilities[idx]=el.value;if(el.dataset.c==='nature')t.natures[idx]=el.value;ensureTeamAdjustments(t);updateStatCard(card,item)}}});card.querySelectorAll('[data-match-poke]').forEach(el=>el.onchange=()=>{item.pokemon=item.pokemon||Array(6).fill('');item.pokemon[+el.dataset.matchPoke]=el.value.trim();item.linkedTeamId='';t.updatedAt=new Date().toISOString();scheduleSave();renderDetail()});card.querySelectorAll('[data-ev]').forEach(el=>el.oninput=()=>{item.ev=item.ev||{};const key=el.dataset.ev;const others=['H','A','B','C','D','S'].filter(k=>k!==key).reduce((sum,k)=>sum+clampNum(item.ev[k]??0,0,32),0);const allowed=Math.max(0,Math.min(32,66-others));item.ev[key]=Math.min(clampNum(el.value,0,32),allowed);el.value=item.ev[key];scheduleSave();updateStatCard(card,item)});card.querySelectorAll('[data-iv]').forEach(el=>el.oninput=()=>{item.iv=item.iv||{};item.iv[el.dataset.iv]=clampNum(el.value,0,31);scheduleSave();updateStatCard(card,item)});card.querySelectorAll('[data-move-slot]').forEach(el=>{el.oninput=()=>{item.moveSlots=item.moveSlots||['','','',''];item.moveSlots[+el.dataset.moveSlot]=el.value;item.moves=item.moveSlots.filter(Boolean).join(' / ');t.updatedAt=new Date().toISOString();scheduleSave()};attachAutocomplete(el,'move')});card.querySelectorAll('[data-move-alt]').forEach(el=>{el.oninput=()=>{item.moveAlternatives=item.moveAlternatives||['','','',''];item.moveAlternatives[+el.dataset.moveAlt]=el.value;t.updatedAt=new Date().toISOString();scheduleSave()};attachAutocomplete(el,'move')});if(key==='adjustments'){const historyBtn=card.querySelector('[data-open-history]');if(historyBtn)historyBtn.onclick=()=>openAdjustmentHistoryPicker(t.id,idx,t.pokemon[idx]);updateStatCard(card,item)};
      const search=card.querySelector('[data-match-search]');if(search){const results=card.querySelector('.matchup-results');const hide=()=>setTimeout(()=>results.classList.remove('show'),150);search.oninput=()=>{const matches=matchupSearchResults(search.value);results.innerHTML=matches.length?matches.map(team=>`<button class="matchup-result" type="button" data-team-choice="${team.id}"><strong>${esc(team.user||'使用者未登録')} / ${esc(team.rank||'順位未登録')} / ${esc(team.title||'構築名未登録')}</strong><small>${esc((team.pokemon||[]).filter(Boolean).join(' / '))}</small></button>`).join(''):'<div class="sub" style="padding:10px">該当する構築がありません。下の欄へ直接入力できます。</div>';results.classList.add('show');results.querySelectorAll('[data-team-choice]').forEach(btn=>btn.onclick=()=>{const team=state.teams.find(x=>x.id===btn.dataset.teamChoice);if(!team)return;applyTeamToMatchup(item,team);t.updatedAt=new Date().toISOString();scheduleSave();renderDetail()})};search.onblur=hide;const clear=card.querySelector('[data-clear-link]');if(clear)clear.onclick=()=>{item.linkedTeamId='';scheduleSave();renderDetail()}}
      card.querySelectorAll('[data-c="pokemon"]').forEach(el=>attachAutocomplete(el,'pokemon',()=>{if(key==='adjustments'&&isMegaPokemon(el.value)){item.item=megaStoneFor(el.value);scheduleSave();renderDetail()}}));if(key==='pokemonChanges'){card.querySelectorAll('[data-c="from"],[data-c="to"]').forEach(el=>attachAutocomplete(el,'pokemon'))}if(key==='adjustments'){const cand=card.querySelector('[data-c="pokemonCandidate"]');if(cand)attachAutocomplete(cand,'pokemon');const itemInput=card.querySelector('[data-c="item"]');if(itemInput){if(isMegaPokemon(item.pokemon)){item.item=megaStoneFor(item.pokemon);itemInput.value=item.item;itemInput.disabled=true;itemInput.title='メガシンカのため持ち物は専用メガストーン固定です'}attachAutocomplete(itemInput,'item')}const abilityInput=card.querySelector('[data-c="ability"]');if(abilityInput)attachAbilityAutocomplete(abilityInput,()=>item.pokemon)}card.querySelectorAll('[data-match-poke]').forEach(el=>attachAutocomplete(el,'pokemon'));
      const del=card.querySelector('.delete-card');if(del)del.onclick=()=>{if(confirm('この項目を削除しますか？')){t[key].splice(idx,1);scheduleSave();renderDetail()}}})}


  function enableAutoGrow(el){if(!el)return;const grow=()=>{el.style.height='auto';el.style.height=Math.max(el.scrollHeight,72)+'px'};el.addEventListener('input',grow);requestAnimationFrame(grow)}

  function clampNum(v,min,max){const n=Number(v);return Number.isFinite(n)?Math.max(min,Math.min(max,Math.trunc(n))):min}
  function effortPointToEV(v){const p=clampNum(v,0,32);return p<=0?0:Math.min(252,4+(p-1)*8)}
  function legacyEVToPoint(v){const n=Number(v)||0;if(n<=32)return clampNum(n,0,32);return Math.min(32,Math.max(0,Math.round((n+4)/8)))}
  function natureMultiplier(nature,stat){const n=NATURES[nature]||{};if(n.up===stat)return 1.1;if(n.down===stat)return .9;return 1}
  function calculateStats(base,item){const keys=['H','A','B','C','D','S'],out={};for(const k of keys){const b=Number(base[k]||0),iv=clampNum(item.iv?.[k]??31,0,31),ev=effortPointToEV(item.ev?.[k]??0);if(k==='H')out[k]=Math.floor(((2*b+iv+Math.floor(ev/4))*50)/100)+60;else{const raw=Math.floor(((2*b+iv+Math.floor(ev/4))*50)/100)+5;out[k]=Math.floor(raw*natureMultiplier(item.nature,k))}}return out}
  async function updateStatCard(card,item){
    item.ev=sanitizeEffortObject(item.ev||{});
    card.querySelectorAll('[data-ev]').forEach(el=>{el.value=item.ev[el.dataset.ev]??0});
    const remaining=effortRemaining(item.ev),remainEl=card.querySelector('[data-ev-remaining]');if(remainEl){remainEl.textContent=`残り ${remaining} / 66`;remainEl.classList.toggle('complete',remaining===0)}
    const effortLine=`振り方：${['H','A','B','C','D','S'].map(k=>`${k}${item.ev[k]||0}`).join(', ')}`;
    const partyEffort=document.querySelector(`[data-party-effort="${card.dataset.index}"]`);if(partyEffort)partyEffort.textContent=effortLine;
    const note=card.querySelector('[data-stat-note]');if(!card.isConnected)return;if(note)note.textContent='種族値を取得中…';const d=await pokemonData(item.pokemon);if(!card.isConnected)return;if(!d){card.querySelectorAll('[data-stat-output]').forEach(o=>o.textContent='－');const top=document.querySelector(`[data-party-stat="${card.dataset.index}"]`),before=document.querySelector(`[data-party-base-stat="${card.dataset.index}"]`);if(top)top.textContent='調整後：H－ A－ B－ C－ D－ S－';if(before)before.textContent='調整前：H－ A－ B－ C－ D－ S－';if(note)note.textContent='ポケモン名を確認してください。メガ・リージョンフォームにも対応しています。';return}const map={hp:'H',attack:'A',defense:'B','special-attack':'C','special-defense':'D',speed:'S'},base={};d.stats.forEach(x=>base[map[x.stat.name]]=x.base_stat);const vals=calculateStats(base,item),baseVals=calculateStats(base,{nature:'',iv:{H:31,A:31,B:31,C:31,D:31,S:31},ev:{H:0,A:0,B:0,C:0,D:0,S:0}});card.querySelectorAll('[data-stat-output]').forEach(o=>o.textContent=vals[o.dataset.statOutput]??'－');const top=document.querySelector(`[data-party-stat="${card.dataset.index}"]`),before=document.querySelector(`[data-party-base-stat="${card.dataset.index}"]`);if(top)top.textContent=`調整後：${statSummary(vals)}`;if(before)before.textContent=`調整前：${statSummary(baseVals)}`;if(note)note.textContent=`種族値：H${base.H} A${base.A} B${base.B} C${base.C} D${base.D} S${base.S} ／ Lv50`;}



  function registeredPokemonNames(){
    const names=[];state.teams.forEach(t=>(t.pokemon||[]).forEach(n=>{n=String(n||'').trim();if(n)names.push(n)}));
    normalizePairingGroups();state.pairings.forEach(p=>[...p.pokemon,...relationRows(p.counterGroups).flat(),...relationRows(p.complementGroups).flat(),...relationRows(p.strongAgainstGroups).flat()].forEach(n=>{n=String(n||'').trim();if(n)names.push(n)}));
    normalizePokemonRelations();state.pokemonRelations.forEach(r=>{if(r.name)names.push(r.name);[...relationRows(r.counterGroups).flat(),...relationRows(r.complementGroups).flat()].forEach(n=>{n=String(n||'').trim();if(n)names.push(n)})});
    return [...new Set(names.map(normalizePokemonName).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ja'));
  }
  function pokemonOccurrences(name){
    const target=normalizePokemonName(name),rows=[];
    state.teams.forEach(team=>{ensureTeamAdjustments(team);(team.pokemon||[]).forEach((n,i)=>{if(normalizePokemonName(n)!==target)return;const a=team.adjustments[i]||blankAdjustment();rows.push({team,index:i,adjustment:a,updatedAt:team.updatedAt||''})})});
    return rows.sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)));
  }
  function splitMoves(v){if(Array.isArray(v))return v.filter(Boolean).slice(0,4);return String(v||'').split(/[\/、,，\n]+/).map(x=>x.trim()).filter(Boolean).slice(0,4)}
  function effortText(obj){return ['H','A','B','C','D','S'].map(k=>`${k}${clampNum(obj?.[k]??0,0,32)}`).join(' ')}
  function individualText(obj){return ['H','A','B','C','D','S'].map(k=>`${k}${clampNum(obj?.[k]??31,0,31)}`).join(' ')}
  function hideAllViews(){['listView','detailView','pokemonView','pairingView','pairingEditView','battleToolView','battleMemoView','teamPickerView','damageHistoryView','battleHistoryView'].forEach(id=>$('#'+id)?.classList.remove('active'))}
  function openAdjustmentHistoryPicker(teamId,index,pokemon){
    if(!pokemon)return;
    state.historyPick={teamId,index,pokemon,returnContext:state.detailReturn};
    openPokemonPage(pokemon);
  }
  function applyHistoryPick(sourceTeamId,sourceIndex){
    const pick=state.historyPick;if(!pick)return;
    const targetTeam=state.teams.find(x=>x.id===pick.teamId),sourceTeam=state.teams.find(x=>x.id===sourceTeamId);
    if(!targetTeam||!sourceTeam)return;
    ensureTeamAdjustments(targetTeam);ensureTeamAdjustments(sourceTeam);
    const target=targetTeam.adjustments?.[pick.index],source=sourceTeam.adjustments?.[sourceIndex];
    if(!target||!source)return;
    copyAdjustmentFromHistory(target,source,pick.pokemon);
    targetTeam.items[pick.index]=isMegaPokemon(pick.pokemon)?megaStoneFor(pick.pokemon):target.item||'';
    target.item=targetTeam.items[pick.index];
    targetTeam.abilities[pick.index]=target.ability||'';
    targetTeam.natures[pick.index]=target.nature||'';
    targetTeam.updatedAt=new Date().toISOString();
    const returnContext=pick.returnContext;state.historyPick=null;scheduleSave();openDetail(targetTeam.id,returnContext);toast('過去の型を反映しました');
  }
  function openPokemonSearch(){
    const modal=$('#pokemonSearchModal'),input=$('#pokemonIndexSearch');renderPokemonQuickList();modal.classList.add('show');input.value='';input.focus();renderPokemonIndexSuggestions('');
  }
  function pokemonMetaCount(name){const r=pairingRelationsForPokemon(name);return pokemonOccurrences(name).length+r.main.length+r.counter.length+r.complement.length+r.against.length}
  function renderPokemonQuickList(){const names=registeredPokemonNames();$('#pokemonIndexQuickList').innerHTML=names.length?names.map(n=>`<button class="pokemon-chip" data-pokemon-page="${esc(n)}">${esc(n)}（${pokemonMetaCount(n)}）</button>`).join(''):'<div class="empty">まだポケモンが登録されていません。</div>';bindPokemonPageButtons($('#pokemonIndexQuickList'))}
  function renderPokemonIndexSuggestions(q){
    const box=$('#pokemonIndexSuggestions'),norm=searchNorm(q);let names=registeredPokemonNames();if(norm)names=names.filter(n=>searchNorm(n).includes(norm)).sort((a,b)=>Number(searchNorm(b).startsWith(norm))-Number(searchNorm(a).startsWith(norm))||a.localeCompare(b,'ja'));names=names.slice(0,30);box.innerHTML=names.map(n=>`<button type="button" class="autocomplete-option" data-pokemon-page="${esc(n)}">${esc(n)} <small>${pokemonMetaCount(n)}件</small></button>`).join('');box.classList.toggle('show',names.length>0);bindPokemonPageButtons(box)
  }
  function bindPokemonPageButtons(root=document){root.querySelectorAll('[data-pokemon-page]').forEach(b=>b.onclick=()=>{const n=b.dataset.pokemonPage;$('#pokemonSearchModal').classList.remove('show');openPokemonPage(n)})}
  async function openPokemonPage(name,returnView=null){
    name=normalizePokemonName(name);state.currentPokemon=name;state.pokemonReturnView=returnView;hideAllViews();$('#pokemonView').classList.add('active');$('#pokemonPageTitle').textContent=state.historyPick||state.damageSetPick?`${name}：反映する型を選択`:`${name}のまとめ`;await renderPokemonPage();scrollTo(0,0)
  }
  function pairingRelationsForPokemon(name){const target=normalizePokemonName(name),has=(rows)=>relationRows(rows).some(row=>row.some(n=>normalizePokemonName(n)===target));return {main:state.pairings.filter(p=>(p.pokemon||[]).some(n=>normalizePokemonName(n)===target)),counter:state.pairings.filter(p=>has(p.counterGroups)),complement:state.pairings.filter(p=>has(p.complementGroups)),against:state.pairings.filter(p=>has(p.strongAgainstGroups))}}
  function pokemonPairingCard(p){return `<button type="button" class="pokemon-pairing-card pairing-status-${esc(p.metaStatus||'－')}" data-open-pairing-from-pokemon="${p.id}"><span class="meta-status status-${esc(p.metaStatus||'－')}">${esc(p.metaStatus||'－')}</span><strong>${esc(p.name||p.pokemon.filter(Boolean).join('＋')||'名称未設定')}</strong><span class="pokemon-pairing-images">${p.pokemon.filter(Boolean).map(n=>`<img data-pokemon="${esc(n)}" src="${imgFor(n)}" alt="${esc(n)}">`).join('')}</span><span class="pokemon-pairing-arrow">›</span></button>`}
  function pokemonPairingSectionsHTML(name){const rows=pairingRelationsForPokemon(name).main;return `<div class="pokemon-meta-summary"><h2>メタ研究とのつながり</h2><div class="section pokemon-meta-section main"><h3>このポケモンを含む並び</h3><div class="pokemon-pairing-list">${rows.length?rows.map(pokemonPairingCard).join(''):'<div class="empty compact">該当する並びはありません。</div>'}</div></div></div>`}
  function normalizePokemonRelations(){state.pokemonRelations=Array.isArray(state.pokemonRelations)?state.pokemonRelations:[];const merged=new Map();state.pokemonRelations.forEach(r=>{const name=normalizePokemonName(r?.name);if(!name)return;const current=merged.get(name)||{name,counterGroups:[],complementGroups:[]};current.counterGroups.push(...relationEntries(r?.counterGroups||[],[]));current.complementGroups.push(...relationEntries(r?.complementGroups||[],[]));merged.set(name,current)});state.pokemonRelations=[...merged.values()].map(r=>({name:r.name,counterGroups:r.counterGroups.length?r.counterGroups:[{names:Array(6).fill(''),memo:''}],complementGroups:r.complementGroups.length?r.complementGroups:[{names:Array(6).fill(''),memo:''}]}))}
  function pokemonRelationRecord(name){normalizePokemonRelations();const canonical=normalizePokemonName(name);let record=state.pokemonRelations.find(r=>r.name===canonical);if(!record){record={name:canonical,counterGroups:[{names:Array(6).fill(''),memo:''}],complementGroups:[{names:Array(6).fill(''),memo:''}]};state.pokemonRelations.push(record)}return record}
  function pokemonDirectEditorHTML(name){const record=pokemonRelationRecord(name),section=(title,description,key,memoPlaceholder,cls)=>`<div class="section pokemon-direct-editor ${cls}"><div class="pairing-relation-title"><div><h3>${title}</h3><p class="sub">${description}</p></div><button type="button" class="btn small pairing-add-row" data-add-pokemon-direct="${key}">＋ 行を追加</button></div><div class="pokemon-direct-rows">${relationEntries(record[key]).map((row,index)=>`<div class="pokemon-direct-row"><div class="pairing-row-number">${index+1}</div><div class="pokemon-direct-left"><input data-pokemon-direct-key="${key}" data-pokemon-direct-index="${index}" value="${esc(row.names.filter(Boolean).join('、'))}" placeholder="、で区切って打ってください"><div class="pairing-relation-preview">${row.names.filter(Boolean).map(n=>`<div class="pairing-mon"><img data-pokemon="${esc(n)}" src="${imgFor(n)}"><small>${esc(normalizePokemonName(n))}</small></div>`).join('')||'<span class="sub">名前を入力すると画像が出ます</span>'}</div></div><textarea data-pokemon-direct-memo-key="${key}" data-pokemon-direct-memo-index="${index}" placeholder="${memoPlaceholder}">${esc(row.memo)}</textarea>${index?`<button type="button" class="pairing-remove-row" data-remove-pokemon-direct="${key}" data-remove-pokemon-direct-index="${index}" aria-label="この行を削除">×</button>`:''}</div>`).join('')}</div></div>`;return section('対策ポケモン',`${esc(normalizePokemonName(name))}への対策を直接登録できます。`,'counterGroups','この対策についてのメモ','counter')+section('補完ポケモン',`${esc(normalizePokemonName(name))}と相性のよい補完を直接登録できます。`,'complementGroups','この補完についてのメモ','complement')}
  function bindPokemonDirectEditor(name){const record=pokemonRelationRecord(name);document.querySelectorAll('[data-pokemon-direct-key]').forEach(el=>{el.onchange=()=>{const key=el.dataset.pokemonDirectKey,i=+el.dataset.pokemonDirectIndex;record[key][i]={...(record[key][i]||{}),names:Array.from({length:6},(_,j)=>pairingNamesInput(el.value)[j]||''),memo:String(record[key][i]?.memo||'')};scheduleSave();renderPokemonPage()}});document.querySelectorAll('[data-pokemon-direct-memo-key]').forEach(el=>{el.oninput=()=>{const key=el.dataset.pokemonDirectMemoKey,i=+el.dataset.pokemonDirectMemoIndex;record[key][i]={...(record[key][i]||{}),names:relationEntries([record[key][i]])[0].names,memo:el.value};scheduleSave()};enableAutoGrow(el)});document.querySelectorAll('[data-add-pokemon-direct]').forEach(btn=>btn.onclick=()=>{record[btn.dataset.addPokemonDirect].push({names:Array(6).fill(''),memo:''});scheduleSave();renderPokemonPage()});document.querySelectorAll('[data-remove-pokemon-direct]').forEach(btn=>btn.onclick=()=>{record[btn.dataset.removePokemonDirect].splice(+btn.dataset.removePokemonDirectIndex,1);scheduleSave();renderPokemonPage()})}
  async function renderPokemonPage(){
    const name=state.currentPokemon,occ=state.historyPick?adjustmentHistoryEntries(name,state.historyPick.teamId,state.historyPick.index):pokemonOccurrences(name),content=$('#pokemonPageContent'),isPicker=!!(state.historyPick||state.damageSetPick);
    content.innerHTML=`<div class="pokemon-profile"><img class="pokemon-profile-image" data-pokemon="${esc(name)}"><div><h2>${esc(name)}</h2><div class="sub">登録 ${occ.length}件</div><div id="pokemonProfileAbilities" style="margin-top:10px">特性：取得中…</div><div class="sub" style="margin-top:8px">基準個体値：H31 A31 B31 C31 D31 S31 ／ 努力値0 ／ 無補正 ／ Lv50</div><div id="pokemonProfileStats" class="profile-stat-grid"></div></div></div><div class="section"><h3>${state.historyPick?'反映する型を選択':'登録された型'}</h3><p class="sub">${state.historyPick?'チェックボタンを押すと、型を反映して構築詳細へ自動で戻ります。':'更新日の新しい順です。'}</p><div id="pokemonSetList" class="pokemon-sets">${occ.length?occ.map(pokemonSetCard).join(''):'<div class="empty">該当する登録がありません。</div>'}</div></div>`;
    occ.forEach(row=>{const card=content.querySelector(`[data-set-key="${row.team.id}-${row.index}"]`),cell=[...(card?.querySelectorAll('.set-cell')||[])].find(x=>x.querySelector('b')?.textContent==='持ち物'),item=row.adjustment?.item||row.team.items?.[row.index]||'';if(cell&&item)cell.insertAdjacentHTML('beforeend',`<img class="pokemon-set-item-image" data-item="${esc(item)}" alt="${esc(item)}">`)});if(!state.historyPick)content.insertAdjacentHTML('beforeend',pokemonDirectEditorHTML(name)+pokemonPairingSectionsHTML(name)+pokemonDamageHistoryHTML(name));hydrateImages(content);if(!state.historyPick)bindPokemonDirectEditor(name);content.querySelectorAll('[data-open-team]').forEach(b=>b.onclick=()=>openDetail(b.dataset.openTeam,{type:'pokemon',name}));content.querySelectorAll('[data-pick-history]').forEach(b=>b.onclick=()=>applyHistoryPick(b.dataset.sourceTeam,+b.dataset.sourceIndex));content.querySelectorAll('[data-open-pairing-from-pokemon]').forEach(b=>b.onclick=()=>openPairingEditor(b.dataset.openPairingFromPokemon));
    const d=await pokemonData(name);if(d){const map={hp:'H',attack:'A',defense:'B','special-attack':'C','special-defense':'D',speed:'S'},base={};d.stats.forEach(x=>base[map[x.stat.name]]=x.base_stat);const vals=calculateStats(base,{nature:'',iv:{H:31,A:31,B:31,C:31,D:31,S:31},ev:{H:0,A:0,B:0,C:0,D:0,S:0}});$('#pokemonProfileStats').innerHTML=['H','A','B','C','D','S'].map(k=>`<div class="profile-stat"><small>${k}</small><br>${vals[k]}</div>`).join('');const abilities=await abilityNamesForPokemon(name);$('#pokemonProfileAbilities').textContent=`特性：${abilities.join(' / ')||'未取得'}`}
    for(const row of occ){const card=content.querySelector(`[data-set-key="${row.team.id}-${row.index}"]`);if(card)updatePokemonSetStats(card,row.adjustment)}
  }
  function pokemonSetCard(row){
    const {team,index,adjustment:a}=row,moves=splitMoves(a.moves);while(moves.length<4)moves.push('－');return `<article class="pokemon-set-card" data-set-key="${team.id}-${index}"><div class="pokemon-set-head"><div><div class="pokemon-set-title-row"><strong>${esc(team.title||'構築名未登録')}</strong><span class="pokemon-set-party">${(team.pokemon||[]).filter(Boolean).map(n=>`<img data-pokemon="${esc(n)}" src="${imgFor(n)}" alt="${esc(n)}" title="${esc(n)}">`).join('')}</span></div><div class="pokemon-set-meta">${esc(team.user||'使用者未登録')} / ${esc(team.rank||'順位未登録')} / ${esc(team.season||'未分類')} / 更新 ${esc((team.updatedAt||'').slice(0,10)||'－')}</div></div>${state.historyPick?`<button class="btn primary history-pick-action" data-pick-history data-source-team="${team.id}" data-source-index="${index}">✓ この型を使う</button>`:`<button class="btn primary" data-open-team="${team.id}">詳細</button>`}</div><div class="set-two-rows"><div><div class="set-info"><div class="set-cell"><b>特性</b>${esc(a.ability||team.abilities?.[index]||'－')}</div><div class="set-cell"><b>持ち物</b>${esc(a.item||team.items?.[index]||'－')}</div><div class="set-cell"><b>性格</b>${esc(natureLabel(a.nature||team.natures?.[index]||'')||'－')}</div><div class="set-cell"><b>努力値</b><span class="ev-line">${effortText(a.ev)}</span></div><div class="set-cell"><b>調整後実数値</b><span class="stat-line" data-set-stats>計算中…</span></div></div><div class="set-moves">${moves.map(m=>`<div class="move-pill">${esc(m)}</div>`).join('')}</div><div class="sub" style="margin-top:8px">個体値：<span class="iv-line">${individualText(a.iv)}</span></div><div class="pokemon-set-memo"><b>調整意図・使用感</b><div>${esc(a.memo||'未登録')}</div></div></div></div></article>`}
  async function updatePokemonSetStats(card,a){const d=await pokemonData(a.pokemon||state.currentPokemon);if(!d)return;const map={hp:'H',attack:'A',defense:'B','special-attack':'C','special-defense':'D',speed:'S'},base={};d.stats.forEach(x=>base[map[x.stat.name]]=x.base_stat);const vals=calculateStats(base,a);const el=card.querySelector('[data-set-stats]');if(el)el.textContent=statSummary(vals)}
  function closePokemonPage(){if(state.damageSetPick){state.damageSetPick=null;state.historyPick=null;openBattleTool(state.battleFormCache?.selfId||'');return}if(state.historyPick){const pick=state.historyPick,ctx=pick.returnContext;state.historyPick=null;openDetail(pick.teamId,ctx);return}if(state.pokemonReturnView==='pairing'){state.pokemonReturnView=null;openPairingList('browse');return}state.pokemonReturnView=null;hideAllViews();$('#listView').classList.add('active');renderList();renderFilters();scrollTo(0,0)}

  function addTeam(){const t=blankTeam();state.teams.unshift(t);scheduleSave();openDetail(t.id)}

  const blankPairing=()=>({id:uid(),date:todayText(),name:'',pokemon:Array(6).fill(''),strength:'',selection:'先発：\n後発：',counter:'',counterPokemon:Array(6).fill(''),complementPokemon:Array(6).fill(''),strongAgainstPokemon:Array(6).fill(''),counterGroups:[Array(6).fill('')],complementGroups:[Array(6).fill('')],strongAgainstGroups:[Array(6).fill('')],metaStatus:'－',season:state.currentSeason==='all'?'未分類':state.currentSeason,memo:'',isNewDraft:true,updatedAt:new Date().toISOString()});
  function pairingHasUserInput(p){if(!p)return false;const text=[p.name,p.strength,p.counter,p.memo,String(p.selection||'').replace(/先発：|後発：/g,'')].some(v=>String(v||'').trim());const pokemon=[...(p.pokemon||[]),...relationRows(p.counterGroups).flat(),...relationRows(p.complementGroups).flat(),...relationRows(p.strongAgainstGroups).flat()].some(v=>String(v||'').trim());const relationMemos=[...relationEntries(p.counterGroups).map(x=>x.memo),...relationEntries(p.complementGroups).map(x=>x.memo),...relationEntries(p.strongAgainstGroups).map(x=>x.memo)].some(v=>String(v||'').trim());return text||pokemon||relationMemos}
  function cleanupEmptyNewPairing(id=state.currentPairingId){const p=state.pairings.find(x=>x.id===id);if(!p?.isNewDraft||pairingHasUserInput(p))return false;state.pairings=state.pairings.filter(x=>x.id!==p.id);if(state.currentPairingId===p.id)state.currentPairingId=null;scheduleSave();return true}
  document.addEventListener('click',e=>{if(e.target?.closest?.('#pairingBackBtn,#pairingEditBackBtn'))cleanupEmptyNewPairing()},true);
  const pairingStatuses=['－','注目','再評価','流行'];
  function pairingNamesInput(value){return splitInput(String(value||'')).slice(0,6)}
  function relationEntries(rows,legacy){const src=Array.isArray(rows)&&rows.length?rows:[legacy||[]];return src.map(row=>{const values=Array.isArray(row)?row:(Array.isArray(row?.names)?row.names:(Array.isArray(row?.pokemon)?row.pokemon:[]));return {names:Array.from({length:6},(_,i)=>values[i]||''),memo:String(row?.memo||'')}})}
  function relationRows(rows,legacy){return relationEntries(rows,legacy).map(row=>row.names)}
  function normalizePairingGroups(){state.pairings.forEach(p=>{p.counterGroups=relationEntries(p.counterGroups,p.counterPokemon);p.complementGroups=relationEntries(p.complementGroups,p.complementPokemon);p.strongAgainstGroups=relationEntries(p.strongAgainstGroups,p.strongAgainstPokemon);p.counterPokemon=p.counterGroups[0]?.names||Array(6).fill('');p.complementPokemon=p.complementGroups[0]?.names||Array(6).fill('');p.strongAgainstPokemon=p.strongAgainstGroups[0]?.names||Array(6).fill('');if(!pairingStatuses.includes(p.metaStatus))p.metaStatus='－'})}
  function pairingRelationHTML(title,key,rows,placeholder){return `<div class="pairing-relation-editor"><div class="pairing-relation-title"><label>${title}</label><button type="button" class="btn small pairing-add-row" data-add-relation="${key}">＋ 行を追加</button></div><div class="pairing-relation-rows">${relationEntries(rows).map((row,index)=>`<div class="pairing-relation-row relation-with-memo"><div class="pairing-row-number">${index+1}</div><div class="pairing-row-main"><input data-relation-key="${key}" data-relation-index="${index}" value="${esc(row.names.filter(Boolean).join(' '))}" placeholder="${placeholder}"><div class="pairing-relation-preview">${row.names.filter(Boolean).map(n=>`<div class="pairing-mon"><img data-pokemon="${esc(n)}" src="${imgFor(n)}"><small>${esc(n)}</small></div>`).join('')||'<span class="sub">名前を入力すると画像が出ます</span>'}</div></div><textarea class="pairing-row-memo" data-relation-memo-key="${key}" data-relation-memo-index="${index}" placeholder="この組み合わせについてのメモ">${esc(row.memo)}</textarea>${index?`<button type="button" class="pairing-remove-row" data-remove-relation="${key}" data-remove-index="${index}" aria-label="この行を削除">×</button>`:''}</div>`).join('')}</div></div>`}
  function pairingModeConfig(mode){
    if(mode==='favorable')return {key:'favorablePairingIds',title:'有利な並び',notice:'この構築が有利な並びを複数選び、「選択を完了」を押してください。'};
    if(mode==='unfavorable')return {key:'unfavorablePairingIds',title:'不利な並び',notice:'この構築が不利な並びを複数選び、「選択を完了」を押してください。'};
    return {key:'relatedPairingIds',title:'関連する並び',notice:'この構築と関連する並びを複数選び、「選択を完了」を押してください。'};
  }
  function pairingLinkSection(t,key,title,mode){
    const rows=(t[key]||[]).map(id=>state.pairings.find(p=>p.id===id)).filter(Boolean);
    return `<div class="section pairing-link-section ${mode}"><div class="section-title-row"><h3>${title}</h3><button type="button" class="btn primary" data-select-pairings="${mode}">並び一覧から選択</button></div><div class="related-pairings">${rows.length?rows.map(p=>`<button type="button" class="related-pairing-link" data-open-pairing="${p.id}"><span><strong>${esc(p.name||'名称未設定')}</strong><small>${esc(p.date||'')}</small></span><span class="related-pairing-images">${p.pokemon.filter(Boolean).slice(0,4).map(n=>`<img data-pokemon="${esc(n)}" src="${imgFor(n)}">`).join('')}</span></button>`).join(''):`<div class="sub">まだ${title}が選択されていません。</div>`}</div></div>`;
  }
  function showOnlyView(id){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id))}
  function openPairingList(mode='browse',teamId=null){normalizePairingGroups();state.pairingMode=mode;state.pairingReturnTeamId=teamId;state.pairingQuery='';showOnlyView('pairingView');const q=$('#pairingSearch');if(q)q.value='';renderPairingList();scrollTo(0,0)}
  function filteredPairings(){const q=searchNorm(state.pairingQuery||''),order={'注目':0,'流行':1,'再評価':2,'－':3};return [...state.pairings].filter(p=>state.pairingStatusFilter==='all'||p.metaStatus===state.pairingStatusFilter).filter(p=>!q||searchNorm([p.name,p.date,p.strength,p.selection,p.counter,p.memo,p.metaStatus,p.season,...p.pokemon,...relationRows(p.counterGroups).flat(),...relationRows(p.complementGroups).flat(),...relationRows(p.strongAgainstGroups).flat(),...relationEntries(p.counterGroups).map(x=>x.memo),...relationEntries(p.complementGroups).map(x=>x.memo),...relationEntries(p.strongAgainstGroups).map(x=>x.memo)].join(' ')).includes(q)).sort((a,b)=>(order[a.metaStatus]??9)-(order[b.metaStatus]??9)||dateSortValue(b.date)-dateSortValue(a.date)||String(b.updatedAt).localeCompare(String(a.updatedAt)))}
  function renderPairingStatusFilters(){const host=$('#pairingStatusFilters');if(!host)return;const items=[['all','すべて'],['注目','注目'],['流行','流行'],['再評価','再評価'],['－','－']];host.innerHTML=items.map(([key,label])=>`<button type="button" class="pairing-status-filter status-${key} ${state.pairingStatusFilter===key?'active':''}" data-pairing-status-filter="${key}"><span>${label}</span><b>${key==='all'?state.pairings.length:state.pairings.filter(p=>p.metaStatus===key).length}</b></button>`).join('');host.querySelectorAll('[data-pairing-status-filter]').forEach(btn=>btn.onclick=()=>{state.pairingStatusFilter=btn.dataset.pairingStatusFilter;renderPairingList()})}
  function pairingCardHTML(p){const selecting=['favorable','unfavorable','related'].includes(state.pairingMode);const team=state.teams.find(t=>t.id===state.pairingReturnTeamId);const cfg=pairingModeConfig(state.pairingMode);const checked=!!team?.[cfg.key]?.includes(p.id);const rel=(title,rows,cls)=>`<div class="pairing-card-relation ${cls}"><b>${title}</b><div class="pairing-card-groups">${relationRows(rows).filter(row=>row.some(Boolean)).map((names,i)=>`<div class="pairing-card-group"><em>${i+1}</em>${names.filter(Boolean).map(n=>`<span><img data-pokemon="${esc(n)}" src="${imgFor(n)}" title="${esc(n)}"></span>`).join('')}</div>`).join('')||'<small>未登録</small>'}</div></div>`;return `<article class="pairing-entry meta-pairing-card"><div class="pairing-entry-head">${selecting?`<label class="pairing-check"><input type="checkbox" data-pairing-check="${p.id}" ${checked?'checked':''}></label>`:''}<span class="meta-status status-${esc(p.metaStatus||'－')}">${esc(p.metaStatus||'－')}</span><strong>${esc(p.name||p.pokemon.filter(Boolean).join('＋')||'名称未設定')}</strong><span class="pairing-date">${esc(p.season||'')} ${esc(p.date||'')}</span></div><div class="pairing-mons main-pairing-mons">${p.pokemon.filter(Boolean).map(n=>`<div class="pairing-mon"><img data-pokemon="${esc(n)}" src="${imgFor(n)}"><small>${esc(n)}</small></div>`).join('')||'<span class="sub">ポケモン未登録</span>'}</div><div class="pairing-notes"><div class="pairing-note"><b>強み</b>${esc(p.strength||'未入力')}</div><div class="pairing-note"><b>選出・立ち回り</b>${esc(p.selection||'未入力')}</div></div><div class="pairing-relations-grid">${rel('⚔ 対策されるポケモン・並び',p.counterGroups,'counter')}${rel('🧩 補完ポケモン',p.complementGroups,'complement')}${rel('◎ 強く出られる相手',p.strongAgainstGroups,'strong')}</div><div class="pairing-actions"><button class="btn small" data-view-pairing="${p.id}">詳しく見る・編集</button></div></article>`}
  function pairingCardHTMLV19(p){const status=p.metaStatus||'－';return pairingCardHTML(p).replace('◎ 強く出られる相手','◎ この並びが有利な相手').replace('class="pairing-entry meta-pairing-card"',`class="pairing-entry meta-pairing-card pairing-status-${esc(status)}"`).replace(`<span class="meta-status status-${esc(status)}">${esc(status)}</span>`,`<button type="button" class="meta-status pairing-status-button status-${esc(status)}" data-pairing-status="${p.id}" title="ステータスを変更">${esc(status)}</button>`)}
  function renderPairingList(){renderPairingStatusFilters();const list=filteredPairings();const selecting=['favorable','unfavorable','related'].includes(state.pairingMode);const cfg=pairingModeConfig(state.pairingMode);$('#pairingSelectionNotice').hidden=!selecting;$('#pairingSelectionDone').hidden=!selecting;$('#newPairingBtn').hidden=selecting;$('#pairingSelectionNotice').textContent=selecting?cfg.notice:'';$('#pairingSelectionDone').textContent=selecting?`${cfg.title}の選択を完了して構築へ戻る`:'選択を完了して構築へ戻る';$('#pairingList').innerHTML=list.length?list.map(pairingCardHTMLV19).join(''):'<div class="empty">条件に合う並びメモがありません。</div>';hydrateImages($('#pairingList'));document.querySelectorAll('[data-view-pairing]').forEach(b=>b.onclick=()=>openPairingEditor(b.dataset.viewPairing));document.querySelectorAll('[data-pairing-check]').forEach(c=>c.onchange=()=>{const t=state.teams.find(x=>x.id===state.pairingReturnTeamId);if(!t)return;t[cfg.key]=Array.isArray(t[cfg.key])?t[cfg.key]:[];if(c.checked&&!t[cfg.key].includes(c.dataset.pairingCheck))t[cfg.key].push(c.dataset.pairingCheck);if(!c.checked)t[cfg.key]=t[cfg.key].filter(id=>id!==c.dataset.pairingCheck);scheduleSave()})}
  function openPairingStatus(id){const p=state.pairings.find(x=>x.id===id);if(!p)return;const colors={'注目':'#e53935','流行':'#ec5b9c','再評価':'#f39c34','－':'#9aa4a1'};$('#tagOptions').innerHTML=pairingStatuses.map(s=>`<button class="tag-option" data-pairing-status-choice="${s}"><span class="dot" style="background:${colors[s]}"></span><strong>${s}</strong></button>`).join('');document.querySelectorAll('[data-pairing-status-choice]').forEach(b=>b.onclick=()=>{p.metaStatus=b.dataset.pairingStatusChoice;p.updatedAt=new Date().toISOString();scheduleSave();$('#tagModal').classList.remove('show');renderPairingList()});$('#tagModal').classList.add('show')}
  const renderPairingListBase=renderPairingList;renderPairingList=function(){renderPairingListBase();const host=$('#pairingList');host.querySelectorAll('[data-pairing-status]').forEach(b=>b.onclick=e=>{e.stopPropagation();openPairingStatus(b.dataset.pairingStatus)});host.querySelectorAll('img[data-pokemon]').forEach(img=>{img.classList.add('pairing-pokemon-link');img.onclick=e=>{e.stopPropagation();openPokemonPage(img.dataset.pokemon,'pairing')}})}
  function openPairingEditor(id){normalizePairingGroups();state.currentPairingId=id;showOnlyView('pairingEditView');renderPairingEditorV2();scrollTo(0,0)}
  function renderPairingEditor(){const p=state.pairings.find(x=>x.id===state.currentPairingId);if(!p)return;$('#pairingEditTitle').textContent=p.name||p.pokemon.filter(Boolean).join('＋')||'並びを編集';$('#pairingEditContent').innerHTML=`<div class="section meta-editor-head"><h3>基本情報</h3><div class="detail-grid"><div class="field"><label>日付</label><input type="date" data-pairing-field="date" value="${esc(String(p.date||'').replaceAll('/','-'))}"></div><div class="field"><label>環境ステータス</label><select data-pairing-field="metaStatus">${pairingStatuses.map(s=>`<option ${p.metaStatus===s?'selected':''}>${s}</option>`).join('')}</select></div><div class="field"><label>シーズン・環境</label><input data-pairing-field="season" value="${esc(p.season||'')}" placeholder="例：M-5 / S36"></div><div class="field"><label>並び名</label><input data-pairing-field="name" value="${esc(p.name)}" placeholder="未入力ならポケモン名から自動生成"></div></div></div><div class="section"><h3>並び・構築</h3><div class="field"><label>ポケモン名を空白で入力</label><input data-pairing-quick="pokemon" value="${esc(p.pokemon.filter(Boolean).join(' '))}" placeholder="例：プテラ ドドゲザン"></div><div class="pairing-editor-party">${p.pokemon.map((n,i)=>`<div class="pairing-editor-mon"><img data-pokemon="${esc(n)}" src="${imgFor(n)}"><input data-pairing-pokemon="${i}" value="${esc(n)}" placeholder="ポケモン名"></div>`).join('')}</div></div><div class="section"><div class="field"><label>強み</label><textarea class="auto-grow" data-pairing-field="strength" placeholder="この並びで何ができる？">${esc(p.strength)}</textarea></div><div class="field"><label>選出・立ち回り</label><textarea class="auto-grow" data-pairing-field="selection">${esc(p.selection)}</textarea></div><div class="field"><label>対策・注意点</label><textarea class="auto-grow" data-pairing-field="counter">${esc(p.counter)}</textarea></div></div><div class="section meta-relations"><h3>メタ関係</h3>${pairingRelationHTML('⚔ 対策ポケモン・並び','counterPokemon',p.counterPokemon,'例：ライチュウ ムクホーク')}${pairingRelationHTML('🧩 補完ポケモン','complementPokemon',p.complementPokemon,'例：リキキリン ゴリランダー')}${pairingRelationHTML('◎ この並びが強い相手','strongAgainstPokemon',p.strongAgainstPokemon,'例：リザードン エルフーン')}</div><div class="section"><div class="field"><label>自由メモ</label><textarea class="auto-grow" data-pairing-field="memo">${esc(p.memo)}</textarea></div></div>`;hydrateImages($('#pairingEditContent'));document.querySelectorAll('[data-pairing-field]').forEach(el=>{el.oninput=()=>{p[el.dataset.pairingField]=el.dataset.pairingField==='date'?String(el.value).replaceAll('-','/'):el.value;p.updatedAt=new Date().toISOString();scheduleSave();if(el.dataset.pairingField==='name')$('#pairingEditTitle').textContent=el.value||p.pokemon.filter(Boolean).join('＋')||'並びを編集'};if(el.tagName==='TEXTAREA')enableAutoGrow(el)});document.querySelectorAll('[data-pairing-pokemon]').forEach(el=>{attachAutocomplete(el,'pokemon');el.onchange=()=>{p.pokemon[+el.dataset.pairingPokemon]=el.value.trim();if(!p.name)p.name=p.pokemon.filter(Boolean).join('＋');p.updatedAt=new Date().toISOString();scheduleSave();renderPairingEditor()}});document.querySelectorAll('[data-pairing-quick]').forEach(el=>{el.onchange=()=>{const key=el.dataset.pairingQuick;p[key]=Array.from({length:6},(_,i)=>pairingNamesInput(el.value)[i]||'');if(key==='pokemon'&&!p.name)p.name=p[key].filter(Boolean).join('＋');p.updatedAt=new Date().toISOString();scheduleSave();renderPairingEditor()}})}
  function renderPairingEditorV2(){
    const p=state.pairings.find(x=>x.id===state.currentPairingId);if(!p)return;
    $('#pairingEditTitle').textContent=p.name||p.pokemon.filter(Boolean).join('＋')||'並びを編集';
    $('#pairingEditContent').innerHTML=`<div class="section meta-editor-head"><h3>基本情報</h3><div class="detail-grid"><div class="field"><label>日付</label><input type="date" data-pairing-field="date" value="${esc(String(p.date||'').replaceAll('/','-'))}"></div><div class="field"><label>環境ステータス</label><select data-pairing-field="metaStatus">${pairingStatuses.map(s=>`<option ${p.metaStatus===s?'selected':''}>${s}</option>`).join('')}</select></div><div class="field"><label>シーズン・環境</label><input data-pairing-field="season" value="${esc(p.season||'')}" placeholder="例：M-5 / S36"></div><div class="field"><label>並び名</label><input data-pairing-field="name" value="${esc(p.name)}" placeholder="未入力ならポケモン名から自動生成"></div></div></div><div class="section"><h3>並び・構築</h3><div class="field"><label>ポケモン名を空白で入力</label><input data-pairing-quick="pokemon" value="${esc(p.pokemon.filter(Boolean).join(' '))}" placeholder="例：プテラ ドドゲザン"></div><div class="pairing-editor-party">${p.pokemon.map((n,i)=>`<div class="pairing-editor-mon"><img data-pokemon="${esc(n)}" src="${imgFor(n)}"><input data-pairing-pokemon="${i}" value="${esc(n)}" placeholder="ポケモン名"></div>`).join('')}</div></div><div class="section"><div class="field"><label>強み</label><textarea class="auto-grow" data-pairing-field="strength">${esc(p.strength)}</textarea></div><div class="field"><label>選出・立ち回り</label><textarea class="auto-grow" data-pairing-field="selection">${esc(p.selection)}</textarea></div><div class="field"><label>対策・注意点</label><textarea class="auto-grow" data-pairing-field="counter">${esc(p.counter)}</textarea></div></div><div class="section meta-relations"><h3>メタ関係</h3>${pairingRelationHTML('⚔ 対策ポケモン・並び','counterGroups',p.counterGroups,'例：ライチュウ ムクホーク')}${pairingRelationHTML('🧩 補完ポケモン','complementGroups',p.complementGroups,'例：リキキリン ゴリランダー')}${pairingRelationHTML('◎ この並びが強い相手','strongAgainstGroups',p.strongAgainstGroups,'例：リザードン エルフーン')}</div><div class="section"><div class="field"><label>自由メモ</label><textarea class="auto-grow" data-pairing-field="memo">${esc(p.memo)}</textarea></div></div>`;
    $('#pairingEditContent').innerHTML=$('#pairingEditContent').innerHTML.replace('◎ この並びが強い相手','◎ この並びが有利な相手');
    const mainPairingQuick=$('#pairingEditContent [data-pairing-quick="pokemon"]');if(mainPairingQuick){mainPairingQuick.placeholder='、で区切って打ってください';const label=mainPairingQuick.closest('.field')?.querySelector('label');if(label)label.textContent='ポケモン名（、で区切って打ってください）'}
    hydrateImages($('#pairingEditContent'));
    document.querySelectorAll('[data-pairing-field]').forEach(el=>{el.oninput=()=>{p[el.dataset.pairingField]=el.dataset.pairingField==='date'?String(el.value).replaceAll('-','/'):el.value;if(pairingHasUserInput(p))p.isNewDraft=false;p.updatedAt=new Date().toISOString();scheduleSave();if(el.dataset.pairingField==='name')$('#pairingEditTitle').textContent=el.value||p.pokemon.filter(Boolean).join('＋')||'並びを編集'};if(el.tagName==='TEXTAREA')enableAutoGrow(el)});
    document.querySelectorAll('[data-pairing-pokemon]').forEach(el=>{attachAutocomplete(el,'pokemon');el.onchange=()=>{p.pokemon[+el.dataset.pairingPokemon]=el.value.trim();if(!p.name)p.name=p.pokemon.filter(Boolean).join('＋');if(pairingHasUserInput(p))p.isNewDraft=false;p.updatedAt=new Date().toISOString();scheduleSave();renderPairingEditorV2()}});
    document.querySelectorAll('[data-pairing-quick="pokemon"]').forEach(el=>{el.onchange=()=>{p.pokemon=Array.from({length:6},(_,i)=>pairingNamesInput(el.value)[i]||'');if(!p.name)p.name=p.pokemon.filter(Boolean).join('＋');if(pairingHasUserInput(p))p.isNewDraft=false;p.updatedAt=new Date().toISOString();scheduleSave();renderPairingEditorV2()}});
    document.querySelectorAll('[data-relation-key]').forEach(el=>{el.onchange=()=>{const key=el.dataset.relationKey,index=+el.dataset.relationIndex;p[key][index]={...(p[key][index]||{}),names:Array.from({length:6},(_,i)=>pairingNamesInput(el.value)[i]||''),memo:String(p[key][index]?.memo||'')};if(pairingHasUserInput(p))p.isNewDraft=false;p.updatedAt=new Date().toISOString();scheduleSave();renderPairingEditorV2()}});
    document.querySelectorAll('[data-relation-memo-key]').forEach(el=>{el.oninput=()=>{const key=el.dataset.relationMemoKey,index=+el.dataset.relationMemoIndex;p[key][index]={...(p[key][index]||{}),names:relationEntries([p[key][index]])[0].names,memo:el.value};if(pairingHasUserInput(p))p.isNewDraft=false;p.updatedAt=new Date().toISOString();scheduleSave()};enableAutoGrow(el)});
    document.querySelectorAll('[data-add-relation]').forEach(btn=>{btn.onclick=()=>{p[btn.dataset.addRelation].push({names:Array(6).fill(''),memo:''});p.updatedAt=new Date().toISOString();scheduleSave();renderPairingEditorV2()}});
    document.querySelectorAll('[data-remove-relation]').forEach(btn=>{btn.onclick=()=>{p[btn.dataset.removeRelation].splice(+btn.dataset.removeIndex,1);p.updatedAt=new Date().toISOString();scheduleSave();renderPairingEditorV2()}})
  }
  function addPairing(){const p=blankPairing();state.pairings.unshift(p);scheduleSave();openPairingEditor(p.id)}
  function deleteCurrentPairing(){const p=state.pairings.find(x=>x.id===state.currentPairingId);if(!p||!confirm('この並びメモを削除しますか？'))return;state.pairings=state.pairings.filter(x=>x.id!==p.id);state.teams.forEach(t=>{for(const k of ['favorablePairingIds','unfavorablePairingIds','relatedPairingIds'])t[k]=(t[k]||[]).filter(id=>id!==p.id)});scheduleSave();openPairingList()}
  function duplicateCurrent(){const t=current();const copy=structuredClone(t);copy.id=uid();copy.title=(copy.title||'構築')+' コピー';copy.updatedAt=new Date().toISOString();state.teams.unshift(copy);state.currentId=copy.id;scheduleSave();renderDetail();toast('複製しました')}
  function deleteCurrent(){const t=current();if(!t||!confirm('この構築を削除しますか？'))return;state.teams=state.teams.filter(x=>x.id!==t.id);scheduleSave();backToList()}
  function backToList(){cleanupEmptyNewTeam();if(state.detailReturn?.type==='pokemon'){const name=state.detailReturn.name;state.currentId=null;state.detailReturn=null;openPokemonPage(name);return}if(state.detailReturn?.type==='battle'){state.currentId=null;state.detailReturn=null;openBattleTool();return}$('#detailView').classList.remove('active');$('#pokemonView').classList.remove('active');$('#listView').classList.add('active');state.currentId=null;state.detailReturn=null;renderList();renderFilters();scrollTo(0,0)}

  const DAMAGE_TYPES=['ノーマル','ほのお','みず','でんき','くさ','こおり','かくとう','どく','じめん','ひこう','エスパー','むし','いわ','ゴースト','ドラゴン','あく','はがね','フェアリー'];
  function teamLabel(t){return [t.title||'構築名未登録',t.user,t.rank,(t.pokemon||[]).filter(Boolean).join('・')].filter(Boolean).join(' / ')}
  function teamOptions(selected='',selfOnly=false){const rows=state.teams.filter(t=>!selfOnly||t.owner==='self');return '<option value="">選択してください</option>'+rows.map(t=>`<option value="${t.id}" ${t.id===selected?'selected':''}>${esc(teamLabel(t))}</option>`).join('')}
  function damageMonPanel(kind,index){const isAtk=kind==='atk';return `<div class="damage-mon-panel" data-damage-${kind}="${index}"><h4>${isAtk?'攻撃':'防御'}側${index+1}</h4><div class="damage-mon-head"><img data-damage-image data-pokemon=""><div class="field"><label>ポケモン</label><input data-dmg="pokemon" placeholder="ポケモン名"></div></div>${isAtk?`<div class="damage-grid"><div class="field"><label>分類</label><select data-dmg="category"><option value="physical">物理</option><option value="special">特殊</option></select></div><div class="field"><label>努力値</label><input type="number" min="0" max="32" value="0" data-dmg="offenseEv"></div><div class="field"><label>性格</label><select data-dmg="nature"><option value="1">無補正</option><option value="1.1">上昇補正</option><option value="0.9">下降補正</option></select></div><button class="btn small max-build" type="button" data-atk-max>ぶっぱ</button><div class="field"><label>技</label><select data-dmg="savedMove"><option value="">手入力</option>${state.savedMoves.map(m=>`<option value="${m.id}">${esc(m.name)}（${m.power}）</option>`).join('')}</select></div><div class="field"><label>技名</label><input data-dmg="moveName" placeholder="技名"></div><div class="field"><label>威力</label><input type="number" min="1" max="999" value="100" data-dmg="power"></div><div class="field"><label>タイプ</label><select data-dmg="moveType">${DAMAGE_TYPES.map(x=>`<option>${x}</option>`).join('')}</select></div><div class="field"><label>対象</label><select data-dmg="target"><option value="0">防御側1</option><option value="1">防御側2</option></select></div><div class="field"><label>攻撃補正</label><input type="number" step="0.01" value="1" data-dmg="attackMod"></div><div class="field"><label>ダメージ補正</label><input type="number" step="0.01" value="1" data-dmg="damageMod"></div><div class="field"><label>相性</label><select data-dmg="effect"><option value="0">無効 ×0</option><option value="0.25">×0.25</option><option value="0.5">×0.5</option><option value="1" selected>等倍</option><option value="2">×2</option><option value="4">×4</option></select></div></div><div class="damage-checks"><label><input type="checkbox" data-dmg="stab">タイプ一致 ×1.5</label><label><input type="checkbox" data-dmg="spread">範囲技 ×0.75</label><label><input type="checkbox" data-dmg="burn">やけど ×0.5</label></div><div class="damage-move-save"><button class="btn small" type="button" data-save-move>この技を登録</button></div>`:`<div class="damage-grid"><div class="field"><label>HP努力値</label><input type="number" min="0" max="32" value="0" data-dmg="hpEv"></div><div class="field"><label>B努力値</label><input type="number" min="0" max="32" value="0" data-dmg="bEv"></div><div class="field"><label>D努力値</label><input type="number" min="0" max="32" value="0" data-dmg="dEv"></div><div class="field"><label>防御性格</label><select data-dmg="defNature"><option value="none">無補正</option><option value="B">B上昇</option><option value="D">D上昇</option></select></div><div class="field"><label>防御補正</label><input type="number" step="0.01" value="1" data-dmg="defenseMod"></div></div><div class="damage-max-buttons"><button class="btn small" type="button" data-def-max="B">HBぶっぱ</button><button class="btn small" type="button" data-def-max="D">HDぶっぱ</button></div>`}<div class="damage-stat-preview" data-damage-stats>ポケモン名を入力してください</div></div>`}
  function battleToolHTML(){return `<div class="section battle-team-select"><h3>対戦メモ</h3><div class="battle-select-grid"><div class="field"><label>自分の構築</label><select id="battleSelfTeam">${teamOptions(state.battleReturnTeamId,true)}</select></div><div class="field"><label>相手の構築</label><select id="battleOpponentTeam">${teamOptions()}</select></div></div><button id="newBattleOpponent" class="btn small">＋ 相手構築を新規登録</button><div class="field"><label>メモ</label><textarea id="battleMemo" class="auto-grow" placeholder="対戦内容、選出、反省などを自由に記録"></textarea></div><button id="saveBattleMemo" class="btn primary">この対戦メモを保存</button></div><div class="section"><div class="section-title-row"><h3>ダメージ計算</h3><button id="runDamageCalc" class="btn primary">計算する</button></div><p class="sub">Lv.50、個体値31。努力値は各能力0〜32、合計上限66です。特性・持ち物・フィールド等は倍率欄へ入力できます。</p><div class="damage-columns"><div><h3>攻撃側（2匹）</h3>${damageMonPanel('atk',0)}${damageMonPanel('atk',1)}</div><div><h3>防御側（2匹）</h3>${damageMonPanel('def',0)}${damageMonPanel('def',1)}</div></div><div id="damageResult" class="damage-result">入力後「計算する」を押してください。</div></div>`}
  function openBattleTool(selfTeamId=''){state.battleReturnTeamId=selfTeamId||state.battleReturnTeamId||'';hideAllViews();$('#battleToolView').classList.add('active');$('#battleToolContent').innerHTML=battleToolHTML();enhanceMultiplierSelectors();bindBattleTool();restoreBattleForm(state.battleFormCache);enhanceBattleV27();hydrateImages($('#battleToolContent'));scrollTo(0,0)}
  function enhanceMultiplierSelectors(){const options=[['1','×1.0'],['1.1','×1.1'],['1.2','×1.2'],['1.3','×1.3'],['1.33','×1.33'],['1.5','×1.5'],['2','×2.0'],['0.75','×0.75'],['0.5','×0.5'],['0.25','×0.25']];document.querySelectorAll('[data-dmg="attackMod"],[data-dmg="defenseMod"],[data-dmg="damageMod"]').forEach(input=>{const select=document.createElement('select');select.dataset.dmg=input.dataset.dmg;select.innerHTML=options.map(([v,l])=>`<option value="${v}">${l}</option>`).join('');select.value='1';input.replaceWith(select)})}
  function readPanel(panel){return Object.fromEntries([...panel.querySelectorAll('[data-dmg]')].map(el=>[el.dataset.dmg,el.type==='checkbox'?el.checked:el.value]))}
  async function damageStatsFor(data,isAtk){const d=await pokemonData(data.pokemon);if(!d)return null;const map={hp:'H',attack:'A',defense:'B','special-attack':'C','special-defense':'D',speed:'S'},base={};d.stats.forEach(x=>base[map[x.stat.name]]=x.base_stat);if(isAtk){const stat=data.category==='special'?'C':'A';const ev={[stat]:clampNum(data.offenseEv,0,32)},nature=Number(data.nature||1);const raw=calculateStats(base,{iv:{H:31,A:31,B:31,C:31,D:31,S:31},ev,nature:''});raw[stat]=Math.floor(raw[stat]*nature);return {base,stats:raw,used:raw[stat],stat}}const ev=sanitizeEffortObject({H:clampNum(data.hpEv,0,32),B:clampNum(data.bEv,0,32),D:clampNum(data.dEv,0,32)}),stats=calculateStats(base,{iv:{H:31,A:31,B:31,C:31,D:31,S:31},ev,nature:''});if(data.defNature==='B')stats.B=Math.floor(stats.B*1.1);if(data.defNature==='D')stats.D=Math.floor(stats.D*1.1);return {base,stats}}
  function damageStep(value,multiplier){return Math.floor(value*Number(multiplier??1))}
  function damageRange(power,attack,defense,mods={}){const base=Math.floor(Math.floor(Math.floor((22*power*attack)/Math.max(1,defense))/50)+2),targetAdjusted=damageStep(base,mods.spread??1),rolls=[];for(let r=85;r<=100;r++){let value=Math.floor(targetAdjusted*r/100);value=damageStep(value,mods.stab??1);value=damageStep(value,mods.effect??1);value=damageStep(value,mods.burn??1);value=damageStep(value,mods.damage??1);rolls.push(Math.max(0,value))}return {min:rolls[0],max:rolls[15],rolls,base}}
  async function calculateBattleDamage(){const atkPanels=[...document.querySelectorAll('[data-damage-atk]')],defPanels=[...document.querySelectorAll('[data-damage-def]')],defs=[];for(const p of defPanels){const data=readPanel(p),calc=await damageStatsFor(data,false);defs.push({data,calc});p.querySelector('[data-damage-stats]').textContent=calc?`HP ${calc.stats.H} / B ${calc.stats.B} / D ${calc.stats.D}`:'ポケモン名を確認してください'}const sums=[{min:0,max:0},{min:0,max:0}],lines=[];for(let i=0;i<atkPanels.length;i++){const p=atkPanels[i],data=readPanel(p),calc=await damageStatsFor(data,true),target=clampNum(data.target,0,1),def=defs[target];if(!calc||!def.calc){lines.push(`攻撃側${i+1}：ポケモン名を確認してください`);continue}const rawDefense=data.category==='special'?def.calc.stats.D:def.calc.stats.B,attack=Math.max(1,damageStep(calc.used,data.attackMod||1)),defense=Math.max(1,damageStep(rawDefense,def.data.defenseMod||1)),mods={spread:data.spread?.toString()==='true'?.75:1,stab:data.stab?1.5:1,effect:Number(data.effect||1),burn:data.burn?.toString()==='true'?.5:1,damage:Number(data.damageMod||1)},range=damageRange(clampNum(data.power,1,999),attack,defense,mods),hp=def.calc.stats.H;sums[target].min+=range.min;sums[target].max+=range.max;p.querySelector('[data-damage-stats]').textContent=`${calc.stat}実数値 ${calc.used}`;lines.push(`${data.pokemon||'攻撃側'+(i+1)}の${data.moveName||'技'} → ${def.data.pokemon||'防御側'+(target+1)}：${range.min}〜${range.max}（${(range.min/hp*100).toFixed(1)}〜${(range.max/hp*100).toFixed(1)}%）`)}for(let i=0;i<2;i++)if(sums[i].max)lines.push(`防御側${i+1}への合計：${sums[i].min}〜${sums[i].max}ダメージ`);$('#damageResult').innerHTML=lines.map(x=>`<div>${esc(x)}</div>`).join('')||'計算できる入力がありません。'}
  function bindBattleTool(){document.querySelectorAll('[data-damage-atk],[data-damage-def]').forEach(panel=>{const input=panel.querySelector('[data-dmg="pokemon"]'),img=panel.querySelector('[data-damage-image]');attachAutocomplete(input,'pokemon');input.onchange=()=>{img.dataset.pokemon=input.value;hydrateImages(panel)};panel.querySelector('[data-atk-max]')?.addEventListener('click',()=>{panel.querySelector('[data-dmg="offenseEv"]').value=32;panel.querySelector('[data-dmg="nature"]').value='1.1'});panel.querySelectorAll('[data-def-max]').forEach(btn=>btn.onclick=()=>{panel.querySelector('[data-dmg="hpEv"]').value=32;panel.querySelector(`[data-dmg="${btn.dataset.defMax.toLowerCase()}Ev"]`).value=32;panel.querySelector('[data-dmg="defNature"]').value=btn.dataset.defMax});panel.querySelector('[data-dmg="savedMove"]')?.addEventListener('change',e=>{const m=state.savedMoves.find(x=>x.id===e.target.value);if(!m)return;panel.querySelector('[data-dmg="moveName"]').value=m.name;panel.querySelector('[data-dmg="power"]').value=m.power;panel.querySelector('[data-dmg="category"]').value=m.category;panel.querySelector('[data-dmg="moveType"]').value=m.type});panel.querySelector('[data-save-move]')?.addEventListener('click',()=>{const d=readPanel(panel);if(!d.moveName||!Number(d.power)){alert('技名と威力を入力してください。');return}state.savedMoves.push({id:uid(),name:d.moveName,power:clampNum(d.power,1,999),category:d.category,type:d.moveType});scheduleSave();openBattleTool($('#battleSelfTeam')?.value||'');toast('技を登録しました')})});$('#runDamageCalc').onclick=calculateBattleDamage;$('#battleToolBackBtn').onclick=()=>{hideAllViews();$('#listView').classList.add('active');renderList()};$('#newBattleOpponent').onclick=()=>{const t=blankTeam();t.owner='other';state.teams.unshift(t);scheduleSave();openDetail(t.id,{type:'battle'})};$('#saveBattleMemo').onclick=()=>{const selfId=$('#battleSelfTeam').value,opponentId=$('#battleOpponentTeam').value,memo=$('#battleMemo').value.trim();if(!selfId||!opponentId||!memo){alert('自分の構築、相手の構築、メモを入力してください。');return}state.battleRecords.unshift({id:uid(),date:todayText(),selfTeamId:selfId,opponentTeamId:opponentId,memo});scheduleSave();state.battleReturnTeamId=selfId;$('#battleMemo').value='';toast('対戦メモを保存しました')};document.querySelectorAll('#battleToolContent textarea.auto-grow').forEach(enableAutoGrow)}
  function battleDataSection(t){const rows=state.battleRecords.filter(r=>r.selfTeamId===t.id),w=rows.filter(r=>r.result==='W').length,l=rows.filter(r=>r.result==='L').length,d=rows.filter(r=>r.result==='D').length,rate=w+l?Math.round(w/(w+l)*1000)/10:0;return `<div class="section battle-data-section"><div class="section-title-row"><div><h3>対戦データを見る</h3><p class="sub">${w}勝 ${l}敗 ${d}分 ／ 勝率 ${rate}% ／ 全${rows.length}件</p></div><button type="button" class="btn primary" data-open-battle-data>対戦結果一覧</button></div></div>`}
  document.addEventListener('click',e=>{if(e.target?.closest?.('#battleToolBtn'))openBattleTool();if(e.target?.closest?.('[data-open-battle-data]')){state.battleReturnTeamId=state.currentId;state.battleFormCache={selfId:state.currentId,opponentId:'',memo:'',result:'W',panels:[]};openBattleHistory()}},true);

  function captureBattleForm(){const data={selfId:$('#battleSelfTeam')?.value||'',opponentId:$('#battleOpponentTeam')?.value||'',memo:$('#battleMemo')?.value||'',result:$('#battleResult')?.value||'W',panels:[]};document.querySelectorAll('[data-damage-atk],[data-damage-def]').forEach(panel=>data.panels.push({kind:panel.hasAttribute('data-damage-atk')?'atk':'def',index:Number(panel.dataset.damageAtk??panel.dataset.damageDef),values:readPanel(panel)}));return data}
  function restoreBattleForm(data){if(!data)return;if($('#battleSelfTeam'))$('#battleSelfTeam').value=data.selfId||'';if($('#battleOpponentTeam'))$('#battleOpponentTeam').value=data.opponentId||'';if($('#battleMemo'))$('#battleMemo').value=data.memo||'';if($('#battleResult'))$('#battleResult').value=data.result||'W';for(const saved of data.panels||[]){const panel=document.querySelector(`[data-damage-${saved.kind}="${saved.index}"]`);if(!panel)continue;for(const [key,value] of Object.entries(saved.values||{})){const el=panel.querySelector(`[data-dmg="${key}"]`);if(!el)continue;if(el.type==='checkbox')el.checked=!!value;else el.value=value}const input=panel.querySelector('[data-dmg="pokemon"]'),img=panel.querySelector('[data-damage-image]');if(img&&input){img.dataset.pokemon=input.value;hydrateImages(panel)}updateDamagePanelPreview(panel)}}
  function selectedTeamButton(kind,select){const btn=document.createElement('button');btn.type='button';btn.className='team-select-visual team-select-large';btn.dataset.openTeamPicker=kind;const team=state.teams.find(t=>t.id===select.value),heading=team?[team.user||'使用者なし',team.title||'構築名未登録',team.rank?`${team.rank}位`:'順位なし'].join(' / '):'';btn.innerHTML=team?`<span><b>${esc(heading)}</b><span class="team-select-images">${team.pokemon.filter(Boolean).map(n=>`<img data-pokemon="${esc(n)}" src="${imgFor(n)}">`).join('')}</span></span><em>変更</em>`:`<span>画像一覧から${kind==='self'?'自分':'相手'}の構築を選択</span><em>選択</em>`;select.hidden=true;select.after(btn)}
  function enhanceBattleV27(){const self=$('#battleSelfTeam'),opp=$('#battleOpponentTeam');if(self)selectedTeamButton('self',self);if(opp)selectedTeamButton('opponent',opp);const memo=$('#battleMemo');if(memo&&!$('#battleResult'))memo.closest('.field').insertAdjacentHTML('beforebegin','<div class="field battle-result-field"><label>対戦結果</label><select id="battleResult"><option value="W">W（勝利）</option><option value="L">L（負け）</option><option value="D">D（引き分け）</option></select></div>');const calcHead=$('#runDamageCalc')?.closest('.section-title-row');if(calcHead){calcHead.insertAdjacentHTML('beforeend','<button type="button" class="btn" id="openDamageHistory">計算履歴</button>')}const memoHead=$('.battle-team-select h3');if(memoHead)memoHead.insertAdjacentHTML('afterend','<button type="button" class="btn small" id="openBattleHistory">対戦結果一覧</button>');document.querySelectorAll('[data-damage-atk],[data-damage-def]').forEach(panel=>{const preview=panel.querySelector('[data-damage-stats]'),field=panel.querySelector('[data-dmg="pokemon"]')?.closest('.field');if(preview&&field){preview.textContent='';field.appendChild(preview)}panel.querySelectorAll('[data-dmg="pokemon"],[data-dmg="offenseEv"],[data-dmg="nature"],[data-dmg="category"],[data-dmg="hpEv"],[data-dmg="bEv"],[data-dmg="dEv"],[data-dmg="defNature"]').forEach(el=>el.addEventListener('change',()=>updateDamagePanelPreview(panel)));updateDamagePanelPreview(panel)});restoreBattleForm(state.battleFormCache);hydrateImages($('#battleToolContent'))}
  async function updateDamagePanelPreview(panel){const data=readPanel(panel),isAtk=panel.hasAttribute('data-damage-atk'),host=panel.querySelector('[data-damage-stats]');if(!host||!data.pokemon){if(host)host.innerHTML='';return}const calc=await damageStatsFor(data,isAtk),d=await pokemonData(data.pokemon);if(!calc||!d){host.innerHTML='';return}const map={hp:'H',attack:'A',defense:'B','special-attack':'C','special-defense':'D',speed:'S'},base={};d.stats.forEach(x=>base[map[x.stat.name]]=x.base_stat);const neutral=calculateStats(base,{iv:{H:31,A:31,B:31,C:31,D:31,S:31},ev:{H:0,A:0,B:0,C:0,D:0,S:0},nature:''});const before=isAtk?`${calc.stat} ${neutral[calc.stat]}`:`H ${neutral.H} / B ${neutral.B} / D ${neutral.D}`,after=isAtk?`${calc.stat} ${calc.used}`:`H ${calc.stats.H} / B ${calc.stats.B} / D ${calc.stats.D}`;host.innerHTML=`<span><small>無振り</small><b>${before}</b></span><span><small>入力反映後</small><b>${after}</b></span>`}
  function renderTeamPicker(q=''){const query=searchNorm(q),rows=state.teams.filter(t=>(state.teamPickerKind!=='self'||t.owner==='self')&&(!query||searchNorm([t.title,t.user,t.rank,...t.pokemon].join(' ')).includes(query)));$('#teamPickerList').innerHTML=rows.length?rows.map(t=>`<article class="team-picker-card ${state.teamPickerArmedId===t.id?'is-armed':''}" data-arm-team="${t.id}"><div class="team-picker-heading"><b>${esc(t.user||'使用者なし')} / ${esc(t.title||'構築名未登録')} / ${esc(t.rank||'順位なし')}</b><small>${state.teamPickerArmedId===t.id?'もう一度タップして選択':'タップして確認'}</small></div><div class="team-picker-images">${t.pokemon.filter(Boolean).map(n=>`<img data-pokemon="${esc(n)}" src="${imgFor(n)}">`).join('')}</div></article>`).join(''):'<div class="empty">該当する構築がありません。</div>';hydrateImages($('#teamPickerList'))}
  function openTeamPicker(kind){state.battleFormCache=captureBattleForm();state.teamPickerKind=kind;state.teamPickerArmedId='';hideAllViews();$('#teamPickerView').classList.add('active');$('#teamPickerTitle').textContent=kind==='self'?'自分の構築を選択':'相手の構築を選択';$('#pickerNewOpponent').hidden=kind!=='opponent';$('#teamPickerSearch').value='';renderTeamPicker();scrollTo(0,0)}
  function openDamageHistory(){state.battleFormCache=captureBattleForm();hideAllViews();$('#damageHistoryView').classList.add('active');$('#damageHistorySearch').value='';renderDamageHistory('')}
  function renderDamageHistory(q){const n=searchNorm(q),rows=state.damageHistory.filter(h=>!n||searchNorm([...(h.pokemon||[]),...(h.moves||[])].join(' ')).includes(n));$('#damageHistoryList').innerHTML=rows.length?rows.map(h=>`<article class="history-result-card"><b>${esc(h.date)}　${esc((h.pokemon||[]).join('・'))}</b><small>${esc((h.moves||[]).filter(Boolean).join(' / '))}</small><div>${esc(h.result)}</div></article>`).join(''):'<div class="empty">計算履歴がありません。</div>'}
  function openBattleHistory(){state.battleFormCache=captureBattleForm();hideAllViews();$('#battleHistoryView').classList.add('active');renderBattleHistory()}
  function battleSummary(teamId){const rows=state.battleRecords.filter(r=>!teamId||r.selfTeamId===teamId),w=rows.filter(r=>r.result==='W').length,l=rows.filter(r=>r.result==='L').length,d=rows.filter(r=>r.result==='D').length,rate=w+l?Math.round(w/(w+l)*1000)/10:0;return {rows,w,l,d,rate}}
  function renderBattleHistory(){const s=battleSummary(state.battleFormCache?.selfId||state.battleReturnTeamId);$('#battleHistorySummary').innerHTML=`<div class="battle-summary"><b>${s.w}勝 ${s.l}敗 ${s.d}分</b><strong>勝率 ${s.rate}%</strong></div>`;$('#battleHistoryList').innerHTML=s.rows.length?s.rows.map(r=>{const o=state.teams.find(t=>t.id===r.opponentTeamId);return `<article class="history-result-card result-${r.result||'D'}"><b>${esc(r.date)}　${esc(r.result||'D')} ／ ${esc(o?teamLabel(o):'削除済み構築')}</b><div>${esc(r.memo)}</div></article>`}).join(''):'<div class="empty">対戦結果がありません。</div>'}
  async function calculateAndStoreDamage(){await calculateBattleDamage();const result=$('#damageResult')?.innerText.trim()||'';if(!result||result.includes('計算できる'))return;const panels=[...document.querySelectorAll('[data-damage-atk],[data-damage-def]')],pokemon=panels.map(p=>p.querySelector('[data-dmg="pokemon"]')?.value).filter(Boolean),moves=[...document.querySelectorAll('[data-damage-atk]')].map(p=>p.querySelector('[data-dmg="moveName"]')?.value).filter(Boolean);state.damageHistory.unshift({id:uid(),date:new Date().toLocaleString('ja-JP'),pokemon,moves,result});scheduleSave()}
  function saveMoveWithoutReset(btn){const panel=btn.closest('[data-damage-atk]'),d=readPanel(panel);if(!d.moveName||!Number(d.power)){alert('技名と威力を入力してください。');return}const move={id:uid(),name:d.moveName,power:clampNum(d.power,1,999),category:d.category,type:d.moveType};state.savedMoves.push(move);document.querySelectorAll('[data-dmg="savedMove"]').forEach(select=>{const option=document.createElement('option');option.value=move.id;option.textContent=`${move.name}（${move.power}）`;select.appendChild(option)});panel.querySelector('[data-dmg="savedMove"]').value=move.id;scheduleSave();toast('技を登録しました')}
  function saveBattleRecordV27(){const selfId=$('#battleSelfTeam').value,opponentId=$('#battleOpponentTeam').value,memo=$('#battleMemo').value.trim(),result=$('#battleResult').value;if(!selfId||!opponentId||!memo){alert('自分の構築、相手の構築、メモを入力してください。');return}state.battleRecords.unshift({id:uid(),date:todayText(),selfTeamId:selfId,opponentTeamId:opponentId,memo,result});scheduleSave();state.battleReturnTeamId=selfId;$('#battleMemo').value='';toast('対戦メモを保存しました')}
  document.addEventListener('click',e=>{const move=e.target.closest?.('[data-save-move]');if(move){e.preventDefault();e.stopImmediatePropagation();saveMoveWithoutReset(move);return}if(e.target.closest?.('#runDamageCalc')){e.preventDefault();e.stopImmediatePropagation();calculateAndStoreDamage();return}if(e.target.closest?.('#saveBattleMemo')){e.preventDefault();e.stopImmediatePropagation();saveBattleRecordV27();return}const picker=e.target.closest?.('[data-open-team-picker]');if(picker){openTeamPicker(picker.dataset.openTeamPicker);return}if(e.target.closest?.('#teamPickerBackBtn,#battleHistoryBackBtn')){openBattleTool(state.battleFormCache?.selfId||'');return}if(e.target.closest?.('#openDamageHistory')){openDamageHistory(state.damageHistoryReturn||'damage');return}if(e.target.closest?.('#openBattleHistory')){openBattleHistory();return}},true);
  document.addEventListener('input',e=>{if(e.target?.id==='teamPickerSearch')renderTeamPicker(e.target.value);if(e.target?.id==='damageHistorySearch')renderDamageHistory(e.target.value);if(e.target?.matches?.('[data-dmg]')){const panel=e.target.closest('[data-damage-atk],[data-damage-def]');if(panel)updateDamagePanelPreview(panel)}});
  document.addEventListener('click',e=>{if(e.target?.closest?.('#newBattleOpponent')){e.preventDefault();e.stopImmediatePropagation();state.battleFormCache=captureBattleForm();const t=blankTeam();t.owner='other';state.teams.unshift(t);state.battleFormCache.opponentId=t.id;scheduleSave();openDetail(t.id,{type:'battle'})}},true);
  const RANK_MULTIPLIERS=[[-6,.25],[-5,2/7],[-4,1/3],[-3,.4],[-2,.5],[-1,2/3],[0,1],[1,1.5],[2,2],[3,2.5],[4,3],[5,3.5],[6,4]];
  function rankMultiplierOptions(){return RANK_MULTIPLIERS.map(([rank,value])=>`<option value="${value}">×${Number(value.toFixed(3))}（${rank>0?'＋'+rank:rank<0?'−'+Math.abs(rank):'0'}）</option>`).join('')}
  function enhanceMultiplierSelectors(){document.querySelectorAll('[data-dmg="attackMod"],[data-dmg="defenseMod"]').forEach(input=>{const select=document.createElement('select');select.dataset.dmg=input.dataset.dmg;select.innerHTML=rankMultiplierOptions();select.value='1';input.replaceWith(select)});const options=[['1','×1.0'],['1.1','×1.1'],['1.2','×1.2'],['1.3','×1.3'],['1.33','×1.33'],['1.5','×1.5'],['2','×2.0'],['0.75','×0.75'],['0.5','×0.5'],['0.25','×0.25']];document.querySelectorAll('[data-dmg="damageMod"]').forEach(input=>{const select=document.createElement('select');select.dataset.dmg='damageMod';select.innerHTML=options.map(([v,l])=>`<option value="${v}">${l}</option>`).join('');select.value='1';input.replaceWith(select)})}
  function damageCalculatorHTML(){return `<div class="section damage-calculator-section"><div class="section-title-row"><h3>ダメージ計算</h3><div class="toolbar"><button type="button" class="btn" id="openDamageHistory">計算履歴</button><button id="runDamageCalc" class="btn primary">計算する</button></div></div><p class="sub">Lv.50・個体値31。努力値は0〜32。攻撃・防御補正は能力ランク（−6〜＋6）から選択できます。</p><div id="damageResult" class="damage-result">入力後「計算する」を押してください。</div><div class="damage-columns"><div class="damage-side"><h3>攻撃側</h3>${damageMonPanel('atk',0)}${damageMonPanel('atk',1)}<button type="button" class="btn small add-damage-mon" data-toggle-damage-panel="atk">＋ 攻撃側2匹目を追加</button></div><div class="damage-side"><h3>防御側</h3>${damageMonPanel('def',0)}${damageMonPanel('def',1)}<button type="button" class="btn small add-damage-mon" data-toggle-damage-panel="def">＋ 防御側2匹目を追加</button></div></div></div>`}
  function battleMemoHTML(){return `<div class="section battle-team-select"><div class="section-title-row"><h3>対戦メモ</h3><button type="button" class="btn small" id="openBattleHistory">対戦結果一覧</button></div><div class="battle-select-grid"><div class="field"><label>自分の構築</label><select id="battleSelfTeam">${teamOptions(state.battleReturnTeamId,true)}</select></div><div class="field"><label>相手の構築</label><select id="battleOpponentTeam">${teamOptions()}</select></div></div><button id="newBattleOpponent" class="btn small">＋ 相手構築を新規登録</button><div class="field battle-result-field"><label>対戦結果</label><select id="battleResult"><option value="W">W（勝利）</option><option value="L">L（負け）</option><option value="D">D（引き分け）</option></select></div><div class="field"><label>メモ</label><textarea id="battleMemo" class="auto-grow" placeholder="対戦内容、選出、反省などを自由に記録"></textarea></div><button id="saveBattleMemo" class="btn primary">この対戦メモを保存</button></div><div class="section battle-party-damage"><h3>構築の6体からダメージ計算</h3><p class="sub">画像を押すと、自分側は攻撃側、相手側は防御側へ入力されます。</p><div id="battlePartyPokemon" class="battle-party-pickers"></div></div>${damageCalculatorHTML()}`}
  function openDamageTool(){state.damageHistoryReturn='damage';hideAllViews();$('#battleToolView').classList.add('active');$('#battleToolContent').innerHTML=damageCalculatorHTML();prepareDamageCalculator($('#battleToolContent'));restoreBattleForm(state.battleFormCache);syncSecondaryDamagePanels($('#battleToolContent'));fillSavedMoveSearch();scrollTo(0,0)}
  function openBattleTool(selfTeamId=''){state.damageHistoryReturn='battle';state.battleReturnTeamId=selfTeamId||state.battleReturnTeamId||'';hideAllViews();$('#battleMemoView').classList.add('active');$('#battleMemoContent').innerHTML=battleMemoHTML();if(state.battleFormCache){$('#battleSelfTeam').value=state.battleFormCache.selfId||state.battleReturnTeamId||'';$('#battleOpponentTeam').value=state.battleFormCache.opponentId||''}enhanceBattleMemo();prepareDamageCalculator($('#battleMemoContent'));restoreBattleForm(state.battleFormCache);syncSecondaryDamagePanels($('#battleMemoContent'));renderBattlePartyPickers();scrollTo(0,0)}
  function prepareDamageCalculator(root){enhanceMultiplierSelectors();root.querySelectorAll('[data-damage-atk="1"],[data-damage-def="1"]').forEach(p=>p.classList.add('damage-panel-secondary','is-hidden'));root.querySelectorAll('[data-toggle-damage-panel]').forEach(btn=>btn.onclick=()=>{const panel=root.querySelector(`[data-damage-${btn.dataset.toggleDamagePanel}="1"]`),show=panel.classList.toggle('is-hidden');btn.textContent=show?`＋ ${btn.dataset.toggleDamagePanel==='atk'?'攻撃':'防御'}側2匹目を追加`:'− 2匹目を閉じる'});fillSavedMoveSearch();root.querySelectorAll('[data-damage-atk],[data-damage-def]').forEach(panel=>{const h=panel.querySelector('h4');if(h&&!h.querySelector('[data-clear-damage-mon]'))h.insertAdjacentHTML('beforeend','<button type="button" class="clear-damage-mon" data-clear-damage-mon>解除</button>');panel.querySelector('[data-clear-damage-mon]').onclick=()=>clearDamagePanel(panel);const stab=panel.querySelector('[data-dmg="stab"]');if(stab&&!stab.dataset.initialized){stab.checked=true;stab.dataset.initialized='1'};const old=panel.querySelector('[data-dmg="savedMove"]');if(old){const field=old.closest('.field');field.innerHTML='<label>技</label><input data-saved-move-search list="savedMoveNames" placeholder="登録済みの技を検索">';field.querySelector('input').onchange=e=>applySavedMoveSearch(panel,e.target.value)};const mod=panel.querySelector('[data-dmg="damageMod"]');if(mod&&!panel.querySelector('[data-dmg="damageMod2"]')){const field=mod.closest('.field'),copy=field.cloneNode(true);field.querySelector('label').textContent='ダメージ補正1';copy.querySelector('label').textContent='ダメージ補正2';copy.querySelector('[data-dmg]').dataset.dmg='damageMod2';field.after(copy)}});bindDamagePanels(root);enhanceDamagePreviews(root);hydrateImages(root)}
  function applySavedMoveSearch(panel,value){const m=state.savedMoves.find(x=>searchNorm(x.name)===searchNorm(value));if(!m)return;panel.querySelector('[data-dmg="moveName"]').value=m.name;panel.querySelector('[data-dmg="power"]').value=m.power;panel.querySelector('[data-dmg="category"]').value=m.category;panel.querySelector('[data-dmg="moveType"]').value=m.type;updateDamagePanelPreview(panel)}
  function clearDamagePanel(panel){panel.querySelectorAll('[data-dmg]').forEach(el=>{if(el.type==='checkbox')el.checked=el.dataset.dmg==='stab';else if(el.dataset.dmg==='pokemon'||el.dataset.dmg==='moveName')el.value='';else if(['offenseEv','hpEv','bEv','dEv'].includes(el.dataset.dmg))el.value='0';else if(['nature','attackMod','damageMod','damageMod2','effect','defenseMod'].includes(el.dataset.dmg))el.value='1';else if(el.dataset.dmg==='defNature')el.value='none'});const search=panel.querySelector('[data-saved-move-search]');if(search)search.value='';const img=panel.querySelector('[data-damage-image]');if(img){img.dataset.pokemon='';img.removeAttribute('src')}panel.querySelector('[data-damage-stats]').innerHTML='';toast('ポケモンを解除しました')}
  function fillSavedMoveSearch(){const list=$('#savedMoveNames');if(list)list.innerHTML=state.savedMoves.map(m=>`<option value="${esc(m.name)}">威力${m.power}</option>`).join('')}
  function syncSecondaryDamagePanels(root){for(const side of ['atk','def']){const panel=root.querySelector(`[data-damage-${side}="1"]`),btn=root.querySelector(`[data-toggle-damage-panel="${side}"]`);if(panel?.querySelector('[data-dmg="pokemon"]')?.value){panel.classList.remove('is-hidden');if(btn)btn.textContent='− 2匹目を閉じる'}}}
  function bindDamagePanels(root){root.querySelectorAll('[data-damage-atk],[data-damage-def]').forEach(panel=>{const input=panel.querySelector('[data-dmg="pokemon"]'),img=panel.querySelector('[data-damage-image]');attachAutocomplete(input,'pokemon');input.onchange=()=>{img.dataset.pokemon=input.value;hydrateImages(panel);updateDamagePanelPreview(panel)};panel.querySelector('[data-atk-max]')?.addEventListener('click',()=>{panel.querySelector('[data-dmg="offenseEv"]').value=32;panel.querySelector('[data-dmg="nature"]').value='1.1';updateDamagePanelPreview(panel)});panel.querySelectorAll('[data-def-max]').forEach(btn=>btn.onclick=()=>{panel.querySelector('[data-dmg="hpEv"]').value=32;panel.querySelector(`[data-dmg="${btn.dataset.defMax.toLowerCase()}Ev"]`).value=32;panel.querySelector('[data-dmg="defNature"]').value=btn.dataset.defMax;updateDamagePanelPreview(panel)});panel.querySelector('[data-dmg="savedMove"]')?.addEventListener('change',e=>{const m=state.savedMoves.find(x=>x.id===e.target.value);if(!m)return;panel.querySelector('[data-dmg="moveName"]').value=m.name;panel.querySelector('[data-dmg="power"]').value=m.power;panel.querySelector('[data-dmg="category"]').value=m.category;panel.querySelector('[data-dmg="moveType"]').value=m.type})});root.querySelector('#runDamageCalc').onclick=calculateAndStoreDamage}
  function enhanceDamagePreviews(root){root.querySelectorAll('[data-damage-atk],[data-damage-def]').forEach(panel=>{const preview=panel.querySelector('[data-damage-stats]'),field=panel.querySelector('[data-dmg="pokemon"]')?.closest('.field');if(preview&&field&&!field.contains(preview)){preview.textContent='';field.appendChild(preview)}panel.querySelectorAll('[data-dmg]').forEach(el=>el.addEventListener('change',()=>updateDamagePanelPreview(panel)));updateDamagePanelPreview(panel)})}
  function enhanceBattleMemo(){const self=$('#battleSelfTeam'),opp=$('#battleOpponentTeam');if(self)selectedTeamButton('self',self);if(opp)selectedTeamButton('opponent',opp);$('#newBattleOpponent').onclick=()=>{const t=blankTeam();t.owner='other';state.teams.unshift(t);scheduleSave();openDetail(t.id,{type:'battle'})};$('#saveBattleMemo').onclick=saveBattleRecordV27;document.querySelectorAll('#battleMemoContent textarea.auto-grow').forEach(enableAutoGrow)}
  function renderBattlePartyPickers(){const host=$('#battlePartyPokemon');if(!host)return;const group=(title,teamId,side)=>{const t=state.teams.find(x=>x.id===teamId),names=(t?.pokemon||[]).filter(Boolean);return `<div class="battle-party-picker"><h4>${title}</h4><div class="party-tabs">${names.length?names.map((n,i)=>`<button type="button" class="party-tab" data-party-damage-pokemon="${esc(n)}" data-party-damage-side="${side}" data-party-team="${t.id}" data-party-index="${i}"><img data-pokemon="${esc(n)}" src="${imgFor(n)}"><span>${esc(n)}</span></button>`).join(''):'<span class="sub">構築を選択してください</span>'}</div></div>`};host.innerHTML=group('自分の6体',$('#battleSelfTeam')?.value,'atk')+group('相手の6体',$('#battleOpponentTeam')?.value,'def');host.querySelectorAll('[data-party-damage-pokemon]').forEach(btn=>btn.onclick=()=>applyPartySetToDamage(btn));hydrateImages(host)}
  function applyPartySetToDamage(btn){const side=btn.dataset.partyDamageSide,name=normalizePokemonName(btn.dataset.partyDamagePokemon),panel=[...document.querySelectorAll(`[data-damage-${side}]`)].find(p=>normalizePokemonName(p.querySelector('[data-dmg="pokemon"]')?.value)===name);if(!panel){alert(`先に下の${side==='atk'?'攻撃':'防御'}側へ${name}を登録してください。`);return}state.battleFormCache=captureBattleForm();state.damageSetPick={side,name,panelIndex:Number(panel.dataset.damageAtk??panel.dataset.damageDef)};state.historyPick={teamId:'__damage_calculator__',index:-1,pokemon:name,returnContext:null};openPokemonPage(name,'damageSet')}
  function applyDamageSetPick(sourceTeamId,sourceIndex){const pick=state.damageSetPick,sourceTeam=state.teams.find(t=>t.id===sourceTeamId),a=sourceTeam?.adjustments?.[sourceIndex];if(!pick||!a)return;const saved=(state.battleFormCache.panels||[]).find(p=>p.kind===pick.side&&p.index===pick.panelIndex);if(!saved)return;if(pick.side==='atk'){const key=saved.values.category==='special'?'C':'A';saved.values.offenseEv=a.ev?.[key]||0;saved.values.nature=key==='A'?natureMultiplier(a.nature,'A'):natureMultiplier(a.nature,'C')}else{saved.values.hpEv=a.ev?.H||0;saved.values.bEv=a.ev?.B||0;saved.values.dEv=a.ev?.D||0}state.damageSetPick=null;state.historyPick=null;openBattleTool(state.battleFormCache.selfId||'');toast(`${pick.name}の型を計算欄へ反映しました`)}
  function setDamagePokemon(side,name){const panels=[...document.querySelectorAll(`[data-damage-${side}]`)],panel=panels.find(p=>!p.querySelector('[data-dmg="pokemon"]').value)||panels[0];if(!panel)return;panel.classList.remove('is-hidden');const input=panel.querySelector('[data-dmg="pokemon"]'),img=panel.querySelector('[data-damage-image]');input.value=name;img.dataset.pokemon=name;hydrateImages(panel);updateDamagePanelPreview(panel)}
  async function calculateBattleDamage(){
    const atkPanels=[...document.querySelectorAll('[data-damage-atk]')],defPanels=[...document.querySelectorAll('[data-damage-def]')],defs=[];
    for(const panel of defPanels){const data=readPanel(panel);if(!data.pokemon){defs.push({data,calc:null});continue}const calc=await damageStatsFor(data,false);defs.push({data,calc});if(calc)updateDamagePanelPreview(panel)}
    const sums=[{min:0,max:0},{min:0,max:0}],lines=[];
    for(let i=0;i<atkPanels.length;i++){
      const panel=atkPanels[i],data=readPanel(panel);if(!data.pokemon)continue;
      const calc=await damageStatsFor(data,true),target=clampNum(data.target,0,1),def=defs[target];
      if(!calc||!def?.calc){lines.push(`${data.pokemon||'攻撃側'+(i+1)}：防御側ポケモンを確認してください`);continue}
      const rawDefense=data.category==='special'?def.calc.stats.D:def.calc.stats.B,attack=Math.max(1,damageStep(calc.used,data.attackMod||1)),defense=Math.max(1,damageStep(rawDefense,def.data.defenseMod||1)),mods={spread:data.spread?.toString()==='true'?.75:1,stab:data.stab?1.5:1,effect:Number(data.effect||1),burn:data.burn?.toString()==='true'?.5:1,damage:Number(data.damageMod||1)*Number(data.damageMod2||1)},range=damageRange(clampNum(data.power,1,999),attack,defense,mods),hp=def.calc.stats.H;
      const criticalAttack=Math.max(1,damageStep(calc.used,Math.max(1,Number(data.attackMod||1)))),criticalDefense=Math.max(1,damageStep(rawDefense,Math.min(1,Number(def.data.defenseMod||1)))),critical=damageRange(clampNum(data.power,1,999),criticalAttack,criticalDefense,{...mods,damage:Number(mods.damage||1)*1.5});
      sums[target][`normal${i}Min`]=range.min;sums[target][`normal${i}Max`]=range.max;sums[target].min+=range.min;sums[target].max+=range.max;updateDamagePanelPreview(panel);lines.push(`${data.pokemon}の${data.moveName||'技'} → ${def.data.pokemon}：${range.min}〜${range.max}（${(range.min/hp*100).toFixed(1)}〜${(range.max/hp*100).toFixed(1)}%）`);lines.push(`　急所：${critical.min}〜${critical.max}（${(critical.min/hp*100).toFixed(1)}〜${(critical.max/hp*100).toFixed(1)}%）`);sums[target][`critical${i}Min`]=critical.min;sums[target][`critical${i}Max`]=critical.max;
    }
    for(let i=0;i<2;i++)if(sums[i].max){lines.push(`防御側${i+1}への合計：${sums[i].min}〜${sums[i].max}ダメージ`);if(sums[i].critical0Max)lines.push(`　1匹目のみ急所：${sums[i].min-(sums[i].normal0Min||0)+sums[i].critical0Min}〜${sums[i].max-(sums[i].normal0Max||0)+sums[i].critical0Max}`);if(sums[i].critical1Max)lines.push(`　2匹目のみ急所：${sums[i].min-(sums[i].normal1Min||0)+sums[i].critical1Min}〜${sums[i].max-(sums[i].normal1Max||0)+sums[i].critical1Max}`)}
    $('#damageResult').innerHTML=lines.map(x=>`<div>${esc(x)}</div>`).join('')||'計算できる入力がありません。'
  }
  async function calculateAndStoreDamage(){await calculateBattleDamage();const result=$('#damageResult')?.innerText.trim()||'';if(!result||result.includes('計算できる'))return;const form=captureBattleForm(),attackers=form.panels.filter(p=>p.kind==='atk').map(p=>p.values.pokemon).filter(Boolean),defenders=form.panels.filter(p=>p.kind==='def').map(p=>p.values.pokemon).filter(Boolean),moves=form.panels.filter(p=>p.kind==='atk').map(p=>p.values.moveName).filter(Boolean);state.damageHistory.unshift({id:uid(),date:new Date().toLocaleString('ja-JP'),attackers,defenders,pokemon:[...attackers,...defenders],moves,result,form});scheduleSave();toast('計算履歴に保存しました')}
  function historySides(h){const attackers=(h.attackers||[]).filter(Boolean),defenders=(h.defenders||[]).filter(Boolean);if(!attackers.length&&!defenders.length){const old=(h.pokemon||[]).filter(Boolean);return {attackers:old.slice(0,1),defenders:old.slice(1)}}return {attackers,defenders}}
  function historyPokemonImages(names){return names.map(n=>`<span><img data-pokemon="${esc(n)}" src="${imgFor(n)}"><small>${esc(n)}</small></span>`).join('')||'<small>未登録</small>'}
  function damageHistoryCard(h){const sides=historySides(h);return `<article class="history-result-card damage-history-card"><div class="history-card-actions"><button class="history-restore-check" data-restore-damage="${h.id}" ${h.form?'':'disabled'} title="${h.form?'この計算を復元':'旧履歴は復元できません'}">✓</button></div><div class="damage-history-sides"><div><b>攻撃側</b><div>${historyPokemonImages(sides.attackers)}</div></div><span class="damage-history-arrow">→</span><div><b>防御側</b><div>${historyPokemonImages(sides.defenders)}</div></div></div><small>${esc(h.date)} ／ ${esc((h.moves||[]).filter(Boolean).join('・')||'技名未登録')}</small><div>${esc(h.result)}</div></article>`}
  function renderDamageHistory(q){const n=searchNorm(q),rows=state.damageHistory.filter(h=>!n||searchNorm([...(h.attackers||[]),...(h.defenders||[]),...(h.pokemon||[]),...(h.moves||[])].join(' ')).includes(n));$('#damageHistoryList').innerHTML=rows.length?rows.map(damageHistoryCard).join(''):'<div class="empty">計算履歴がありません。</div>';hydrateImages($('#damageHistoryList'))}
  function damageFormHasInput(form){return !!(form&&(form.panels||[]).some(p=>Object.entries(p.values||{}).some(([k,v])=>k==='pokemon'||k==='moveName'?String(v||'').trim():false)))}
  function restoreDamageHistory(id){const h=state.damageHistory.find(x=>x.id===id);if(!h?.form){alert('この履歴は旧形式のため復元できません。');return}const current=document.querySelector('[data-damage-atk]')?captureBattleForm():state.battleFormCache;if(damageFormHasInput(current)&&!confirm('計算画面に入力中のデータがあります。履歴の内容を復元しますか？'))return;state.battleFormCache=structuredClone(h.form);state.damageHistoryReturn='damage';openDamageTool();toast('計算内容を復元しました')}
  function openDamageHistory(returnTo=state.damageHistoryReturn||'menu'){state.damageHistoryReturn=returnTo;state.battleFormCache=document.querySelector('[data-damage-atk]')?captureBattleForm():state.battleFormCache;hideAllViews();$('#damageHistoryView').classList.add('active');$('#damageHistorySearch').value='';renderDamageHistory('');$('#damageHistoryBackBtn').onclick=e=>{e.stopPropagation();if(state.damageHistoryReturn==='damage')openDamageTool();else if(state.damageHistoryReturn==='battle')openBattleTool(state.battleFormCache?.selfId||'');else if(state.damageHistoryReturn==='pokemon')openPokemonPage(state.currentPokemon);else{hideAllViews();$('#listView').classList.add('active');renderList()}}}
  function pokemonDamageHistoryHTML(name){const target=normalizePokemonName(name),rows=state.damageHistory.filter(h=>{const s=historySides(h);return [...s.attackers,...s.defenders].some(n=>normalizePokemonName(n)===target)});return `<div class="section pokemon-damage-history"><div class="section-title-row"><div><h3>ダメージ計算履歴</h3><p class="sub">このポケモンが攻撃側または防御側で使われた計算です。</p></div><button type="button" class="btn small" data-open-pokemon-damage-history>一覧を見る</button></div><div>${rows.length?rows.slice(0,5).map(damageHistoryCard).join(''):'<div class="empty compact">該当する計算履歴はありません。</div>'}</div></div>`}
  document.addEventListener('click',e=>{if(e.target.closest?.('#damageCalcBtn'))openDamageTool();if(e.target.closest?.('#battleMemoBtn'))openBattleTool();if(e.target.closest?.('#damageHistoryMenuBtn,#damageHistoryDrawerBtn')){closeSettingsMenu();openDamageHistory('menu')}if(e.target.closest?.('[data-open-pokemon-damage-history]'))openDamageHistory('pokemon');if(e.target.closest?.('#battleToolBackBtn,#battleMemoBackBtn')){hideAllViews();$('#listView').classList.add('active');renderList()}},true);
  function exportData(){const blob=new Blob([JSON.stringify({version:'31',exportedAt:new Date().toISOString(),teams:state.teams,pairings:state.pairings,pokemonRelations:state.pokemonRelations,savedMoves:state.savedMoves,battleRecords:state.battleRecords,damageHistory:state.damageHistory,seasons:state.seasons},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`pokemon-team-manager-v31-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href)}
  function importData(file){if(!file)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!Array.isArray(d.teams))throw Error();if(!confirm('現在のデータを読み込みデータで置き換えますか？'))return;state.teams=d.teams;state.pairings=Array.isArray(d.pairings)?d.pairings:[];state.imageMap=d.imageMap||state.imageMap||{};state.seasons=Array.isArray(d.seasons)&&d.seasons.length?d.seasons:['未分類'];state.currentSeason='all';state.sortOrder=d.sortOrder||'manual';state.teams.forEach(t=>{t.favorableMatchups=(t.favorableMatchups||[]).map(x=>({...x,_key:'favorableMatchups',linkedTeamId:x.linkedTeamId||'',pokemon:Array.isArray(x.pokemon)?Array.from({length:6},(_,i)=>x.pokemon[i]||''):Array(6).fill('')}));t.unfavorableMatchups=(t.unfavorableMatchups||[]).map(x=>({...x,_key:'unfavorableMatchups',linkedTeamId:x.linkedTeamId||'',pokemon:Array.isArray(x.pokemon)?Array.from({length:6},(_,i)=>x.pokemon[i]||''):Array(6).fill('')}));t.favorablePairingIds=Array.isArray(t.favorablePairingIds)?t.favorablePairingIds:[];t.unfavorablePairingIds=Array.isArray(t.unfavorablePairingIds)?t.unfavorablePairingIds:[];t.relatedPairingIds=Array.isArray(t.relatedPairingIds)?t.relatedPairingIds:[];t.partyView=t.partyView==='edit'?'edit':'overview';t.overallMemo=t.overallMemo||{lead:'先：\n後：',weak:'',improve:'',battle:'',free:''};if(!String(t.overallMemo.lead||'').trim())t.overallMemo.lead='先：\n後：'});normalizeState();scheduleSave();renderSeasons();renderFilters();renderTeamScopeTabs();renderSortControl();renderList();toast('読み込みました')}catch{alert('正しいバックアップファイルではありません。')}};r.readAsText(file)}
  const importDataBase=importData;importData=function(file){if(!file)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!Array.isArray(d.teams))throw Error();if(!confirm('現在のデータを読み込みデータで置き換えますか？'))return;state.teams=d.teams;state.pairings=Array.isArray(d.pairings)?d.pairings:[];state.pokemonRelations=Array.isArray(d.pokemonRelations)?d.pokemonRelations:[];state.seasons=Array.isArray(d.seasons)&&d.seasons.length?d.seasons:['未分類'];state.currentSeason='all';state.sortOrder=d.sortOrder||'manual';normalizeState();normalizePairingGroups();normalizePokemonRelations();scheduleSave();renderSeasons();renderFilters();renderTeamScopeTabs();renderSortControl();renderList();toast('読み込みました')}catch{alert('正しいバックアップファイルではありません。')}};r.readAsText(file)}

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
        const d=snap.data();state.savedMoves=Array.isArray(d.savedMoves)?d.savedMoves:[];state.battleRecords=Array.isArray(d.battleRecords)?d.battleRecords:[];state.damageHistory=Array.isArray(d.damageHistory)?d.damageHistory:[];
        const localHas=state.teams.length>0;
        const useCloud=!localHas||confirm('クラウドに保存済みのデータがあります。クラウド版をこの端末に読み込みますか？\n\n「キャンセル」を選ぶと、この端末のデータをクラウドへ上書きします。');
        if(useCloud){state.teams=d.teams||[];state.pairings=d.pairings||[];state.pokemonRelations=d.pokemonRelations||[];state.seasons=d.seasons||['未分類'];state.currentSeason=d.currentSeason||'all';state.teamScope=d.teamScope||'world';state.sortOrder=d.sortOrder||'manual';await dbSet('data',payload());normalizeState();normalizePokemonRelations();renderSeasons();renderFilters();renderTeamScopeTabs();renderSortControl();renderList();if(state.currentId)renderDetail();toast('クラウドデータを読み込みました')}
        else await migrateLocalImagesAndSave();
      }else await migrateLocalImagesAndSave();
      setSyncText('クラウド同期済み');
    }catch(e){console.error(e);setSyncText('クラウド読込エラー');alert('クラウドデータを読み込めませんでした。Firestoreの作成とセキュリティルールを確認してください。')}
  }
  async function migrateLocalImagesAndSave(){await dbSet('data',payload());await saveCloud()}

  function openFirebaseModal(){const saved=localStorage.getItem('pokemonFirebaseConfig');$('#firebaseConfigInput').value=saved?JSON.stringify(JSON.parse(saved),null,2):'';$('#firebaseModal').classList.add('show')}
  async function saveFirebaseConfig(){try{const c=normalizeFirebaseConfig($('#firebaseConfigInput').value);for(const k of ['apiKey','authDomain','projectId','appId'])if(!c[k])throw new Error(k);localStorage.setItem('pokemonFirebaseConfig',JSON.stringify(c));$('#firebaseModal').classList.remove('show');await initFirebase(c);toast('Firebase設定を保存しました')}catch(e){console.error(e);alert('設定を読み取れませんでした。firebaseConfigのオブジェクトをそのまま貼り付けてください。')}}
  function normalizeState(){state.seasons=Array.isArray(state.seasons)&&state.seasons.length?state.seasons:['未分類'];state.teams=Array.isArray(state.teams)?state.teams:[];state.pairings=Array.isArray(state.pairings)?state.pairings:[];state.imageMap=state.imageMap||{};state.teams.forEach(t=>{t.season=t.season||'未分類';t.owner=t.owner==='self'?'self':'other';t.date=normalizeDateText(t.date)||normalizeDateText(t.oneLine)||todayText();if(!state.seasons.includes(t.season))state.seasons.push(t.season);t.pokemon=Array.from({length:6},(_,i)=>(t.pokemon||[])[i]||'');t.items=Array.from({length:6},(_,i)=>(t.items||[])[i]||'');t.abilities=Array.from({length:6},(_,i)=>(t.abilities||[])[i]||((t.adjustments||[])[i]?.ability||''));t.natures=Array.from({length:6},(_,i)=>(t.natures||[])[i]||((t.adjustments||[])[i]?.nature||''));t.pokemonChanges=t.pokemonChanges||[];t.moveChanges=t.moveChanges||[];t.adjustments=Array.from({length:6},(_,i)=>{const a=(t.adjustments||[])[i]||blankAdjustment();return {...a,pokemon:t.pokemon[i],item:t.items[i],ability:t.abilities[i],nature:t.natures[i],iv:{H:31,A:31,B:31,C:31,D:31,S:31,...(a.iv||{})},ev:sanitizeEffortObject(Object.fromEntries(['H','A','B','C','D','S'].map(k=>[k,legacyEVToPoint(({H:0,A:0,B:0,C:0,D:0,S:0,...(a.ev||{})})[k])])) )}});t.favorableMatchups=(t.favorableMatchups||[]).map(x=>({...x,_key:'favorableMatchups',linkedTeamId:x.linkedTeamId||'',pokemon:Array.isArray(x.pokemon)?Array.from({length:6},(_,i)=>x.pokemon[i]||''):Array(6).fill('')}));t.unfavorableMatchups=(t.unfavorableMatchups||[]).map(x=>({...x,_key:'unfavorableMatchups',linkedTeamId:x.linkedTeamId||'',pokemon:Array.isArray(x.pokemon)?Array.from({length:6},(_,i)=>x.pokemon[i]||''):Array(6).fill('')}));t.favorablePairingIds=Array.isArray(t.favorablePairingIds)?t.favorablePairingIds:[];t.unfavorablePairingIds=Array.isArray(t.unfavorablePairingIds)?t.unfavorablePairingIds:[];t.relatedPairingIds=Array.isArray(t.relatedPairingIds)?t.relatedPairingIds:[];t.partyView=t.partyView==='edit'?'edit':'overview';t.overallMemo=t.overallMemo||{lead:'先：\n後：',weak:'',improve:'',battle:'',free:''};if(!String(t.overallMemo.lead||'').trim())t.overallMemo.lead='先：\n後：'});state.pairings=state.pairings.map(p=>({...p,id:p.id||uid(),date:normalizeDateText(p.date)||todayText(),name:p.name||'',pokemon:Array.from({length:6},(_,i)=>(p.pokemon||[])[i]||''),strength:p.strength||'',selection:p.selection||'先発：\n後発：',counter:p.counter||'',counterPokemon:Array.from({length:6},(_,i)=>(p.counterPokemon||[])[i]||''),complementPokemon:Array.from({length:6},(_,i)=>(p.complementPokemon||[])[i]||''),strongAgainstPokemon:Array.from({length:6},(_,i)=>(p.strongAgainstPokemon||[])[i]||''),metaStatus:pairingStatuses.includes(p.metaStatus)?p.metaStatus:'注目',season:p.season||'未分類',memo:p.memo||'',updatedAt:p.updatedAt||new Date().toISOString()}))}
  function openSettingsMenu(){const menu=$('#settingsMenu');if(!menu)return;menu.classList.add('show');menu.setAttribute('aria-hidden','false');$('#menuBtn')?.setAttribute('aria-expanded','true');document.body.classList.add('menu-open')}
  function closeSettingsMenu(){const menu=$('#settingsMenu');if(!menu)return;menu.classList.remove('show');menu.setAttribute('aria-hidden','true');$('#menuBtn')?.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')}
  function selectedTeamButton(kind,select){const btn=document.createElement('button');btn.type='button';btn.className='team-select-visual team-select-large';btn.dataset.openTeamPicker=kind;const team=state.teams.find(t=>t.id===select.value),heading=team?[team.user||'使用者なし',team.title||'構築名未登録',team.rank||'順位なし'].join(' / '):'';btn.innerHTML=team?`<span><b>${esc(heading)}</b><span class="team-select-images">${team.pokemon.filter(Boolean).map(n=>`<img data-pokemon="${esc(normalizePokemonName(n))}" src="${imgFor(normalizePokemonName(n))}">`).join('')}</span></span><em>変更</em>`:`<span>画像一覧から${kind==='self'?'自分':'相手'}の構築を選択</span><em>選択</em>`;select.hidden=true;select.after(btn)}
  function saveMoveWithoutReset(btn){const panel=btn.closest('[data-damage-atk]'),d=readPanel(panel);if(!d.moveName||!Number(d.power)){alert('技名と威力を入力してください。');return}const existing=state.savedMoves.find(x=>searchNorm(x.name)===searchNorm(d.moveName));if(existing){existing.power=clampNum(d.power,1,999);existing.category=d.category;existing.type=d.moveType}else state.savedMoves.push({id:uid(),name:d.moveName,power:clampNum(d.power,1,999),category:d.category,type:d.moveType});scheduleSave();fillSavedMoveSearch();const search=panel.querySelector('[data-saved-move-search]');if(search)search.value=d.moveName;toast(existing?'登録技を更新しました':'技を登録しました')}
  document.addEventListener('click',e=>{
    const damageSet=e.target.closest?.('[data-pick-history]');if(damageSet&&state.damageSetPick){e.preventDefault();e.stopImmediatePropagation();applyDamageSetPick(damageSet.dataset.sourceTeam,+damageSet.dataset.sourceIndex);return}
    const restore=e.target.closest?.('[data-restore-damage]');if(restore){e.preventDefault();e.stopImmediatePropagation();restoreDamageHistory(restore.dataset.restoreDamage);return}
    const card=e.target.closest?.('[data-arm-team]');if(card){e.preventDefault();const id=card.dataset.armTeam;if(state.teamPickerArmedId===id){if(state.teamPickerKind==='self')state.battleFormCache.selfId=id;else state.battleFormCache.opponentId=id;state.teamPickerArmedId='';openBattleTool(state.battleFormCache.selfId)}else{state.teamPickerArmedId=id;renderTeamPicker($('#teamPickerSearch')?.value||'')}return}
    if(e.target.closest?.('#pickerNewOpponent')){state.battleFormCache=captureBattleForm();const t=blankTeam();t.owner='other';state.teams.unshift(t);state.battleFormCache.opponentId=t.id;scheduleSave();openDetail(t.id,{type:'battle'});return}
    if(e.target.closest?.('#someoneTeamsBtn')){state.someoneTeamsOnly=!state.someoneTeamsOnly;state.query='';if($('#searchInput'))$('#searchInput').value='';renderList();return}
  },true);
  async function init(){await openDB();const saved=await dbGet('data');if(saved){state.teams=saved.teams||[];state.pairings=saved.pairings||[];state.imageMap=saved.imageMap||{};state.seasons=saved.seasons||['未分類'];state.currentSeason=saved.currentSeason||'all';state.teamScope=saved.teamScope||'world';state.sortOrder=saved.sortOrder||'manual'}normalizeState();renderSeasons();renderFilters();renderTeamScopeTabs();renderSortControl();renderList();$('#menuBtn').onclick=openSettingsMenu;$('#closeMenuBtn').onclick=closeSettingsMenu;$('#settingsMenu').onclick=e=>{if(e.target===$('#settingsMenu'))closeSettingsMenu()};document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSettingsMenu()});$('#searchInput').oninput=e=>{state.query=e.target.value;renderList()};$('#pokemonSearchBtn').onclick=openPokemonSearch;$('#pairingBtn').onclick=()=>openPairingList('browse');$('#pairingBackBtn').onclick=()=>{if(['favorable','unfavorable','related'].includes(state.pairingMode)&&state.pairingReturnTeamId){openDetail(state.pairingReturnTeamId)}else{showOnlyView('listView');renderList()}};$('#newPairingBtn').onclick=addPairing;$('#pairingSearch').oninput=e=>{state.pairingQuery=e.target.value;renderPairingList()};$('#pairingSelectionDone').onclick=()=>openDetail(state.pairingReturnTeamId);$('#pairingEditBackBtn').onclick=()=>openPairingList(state.pairingMode,state.pairingReturnTeamId);$('#deletePairingBtn').onclick=deleteCurrentPairing;$('#closePokemonSearchModal').onclick=()=>$('#pokemonSearchModal').classList.remove('show');$('#pokemonSearchModal').onclick=e=>{if(e.target===$('#pokemonSearchModal'))$('#pokemonSearchModal').classList.remove('show')};$('#pokemonIndexSearch').oninput=e=>renderPokemonIndexSuggestions(e.target.value);$('#pokemonIndexSearch').onkeydown=e=>{if(e.key==='Enter'){const first=$('#pokemonIndexSuggestions [data-pokemon-page]');if(first)first.click()}};$('#pokemonBackBtn').onclick=closePokemonPage;$('#newTeamBtn').onclick=$('#floatingAdd').onclick=addTeam;$('#addSeasonBtn').onclick=addSeason;$('#renameSeasonBtn').onclick=renameSeason;$('#deleteSeasonBtn').onclick=deleteSeason;$('#backBtn').onclick=backToList;$('#duplicateBtn').onclick=duplicateCurrent;$('#deleteTeamBtn').onclick=deleteCurrent;$('#exportBtn').onclick=exportData;$('#importBtn').onclick=()=>$('#importFile').click();$('#importFile').onchange=e=>importData(e.target.files[0]);$('#closeTagModal').onclick=()=>$('#tagModal').classList.remove('show');$('#tagModal').onclick=e=>{if(e.target===$('#tagModal'))$('#tagModal').classList.remove('show')};
    $('#firebaseSetupBtn').onclick=openFirebaseModal;$('#loginBtn').onclick=loginGoogle;$('#logoutBtn').onclick=logoutGoogle;$('#saveFirebaseConfig').onclick=saveFirebaseConfig;$('#closeFirebaseModal').onclick=()=>$('#firebaseModal').classList.remove('show');$('#firebaseModal').onclick=e=>{if(e.target===$('#firebaseModal'))$('#firebaseModal').classList.remove('show')};
    const cfg=localStorage.getItem('pokemonFirebaseConfig');try{await initFirebase(cfg?JSON.parse(cfg):DEFAULT_FIREBASE_CONFIG)}catch(e){console.error(e);setSyncText('Firebase設定エラー')}
  }
  function normalizeAllPokemonNames(){state.teams.forEach(t=>{t.pokemon=(t.pokemon||[]).map(normalizePokemonName);(t.adjustments||[]).forEach((a,i)=>{a.pokemon=normalizePokemonName(a.pokemon||t.pokemon[i]||'')})});state.pairings.forEach(p=>{for(const k of ['pokemon','counterPokemon','complementPokemon','strongAgainstPokemon'])p[k]=(p[k]||[]).map(normalizePokemonName)});normalizePokemonRelations()}
  init().then(()=>{normalizeAllPokemonNames();scheduleSave();renderList()}).catch(e=>{console.error(e);alert('データベースの初期化に失敗しました。プライベートブラウズでは保存できない場合があります。')});
})();
