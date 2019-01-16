import GameConfig from "./GameConfig";
import {PlayerData} from "./view/Config/PlayerData";
import ShopDialog from "./view/ShopDialog";
class Main {
	constructor() {
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		// Laya.alertGlobalError = true;

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	}

	onConfigLoaded(): void {
		//加载IDE指定的场景
		// Laya.URL.basePath = "https://testcdn.chinaxwz.cn/game/gsz/cuterope/";
		let src= [
			{url:"config/selectConfig.json"},
            {url:"config/playerDataTest.json"},
			{url:"config/mapConfig.json"},
			///
			{url:"res/atlas/loadingView.atlas"},
			{url:"unpackage/loadingBg.jpg"}
			
		];
		Laya.loader.load(src,Laya.Handler.create(this,this.onLoad));
	}
	
	private onLoad() : void
	{
		this.keepPlayerData();
		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
	}

	private keepPlayerData() : void
	{
		        //数据保存
		let object = Laya.loader.getRes("config/selectConfig.json");
		this.keepLimit(object.limitList);
		Laya.WeakObject.I.set("boxSkin",object.boxSkin);

		let userData = Laya.loader.getRes("config/playerDataTest.json");
		this.keepUserData(userData);
				//--------------------------
		Laya.loader.clearRes("config/selectConfig.json");
		Laya.loader.clearRes("config/playerDataTest.json");
	}

    /**保存 关卡限制信息*/
    private keepLimit(object) : void
    {
        for(let i=0; i<object.length; i++)
        {
			PlayerData.ins.arr_LimitSelect.push(object[i].selectLimit);
			// Laya.WeakObject.__init__();
			Laya.WeakObject.I.set(i,object[i]);
			
            // PlayerData.ins.boxLimtDic.set(i,object[i]);
		}

	}

    /**保存用户信息 */
    private keepUserData(userData) : void
    {
		PlayerData.ins.starNum = userData.playerStars;
		PlayerData.ins.super = userData.playerSuper;
		PlayerData.ins.teach = userData.PlayerTeach;
    	for(let i=0; i<userData.playerCard.length; i++)
        {
            Laya.WeakObject.I.set(userData.playerCard[i].card,userData.playerCard[i].stars);
		}
		
		//保存dilog
		Laya.WeakObject.I.set("dialog",new ShopDialog());
		// console.log(Laya.WeakObject.I);		
    }
}
//激活启动类
new Main();
