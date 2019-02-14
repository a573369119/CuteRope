import {ui}         from "../ui/layaMaxUI";
import {Config}     from "../config/MapConfig";
import ShopDialog   from "./ShopDialog";
import Hook         from "../prefab/Hook";
import Rope         from "../prefab/Rope";
import Candy         from "../prefab/Candy";
import Tail         from "../Tool/Tail";
import GameConfig   from "../config/GameConfig"
import Monster from "../prefab/Monster";
import Star from "../prefab/Star";
import Balloon from "../prefab/Balloon";
import MagicHat from "../prefab/MagicHat";
import RopePoint from "../prefab/RopePoint";
import Knife from "../prefab/Knife";
import { PlayerData } from "./Config/PlayerData";
import ForceBall from "../prefab/ForceBall";
import Laser from "../prefab/Laser";
import Spider from "../prefab/Spider";
 /**
 * 游戏界面 ani  1：开门动画 2： 
 */
export default class GamePage extends Laya.Scene{
    /**季度 */
    private quarterIndex : number;
    /**盒子 */
    private boxIndex : number;
    /**关卡数 */
    private cardIndex : number;
//----------------------------------------------
    /**加载 */
    private doorOpen : ui.GameView.GameViewDoorUI;
    /**菜单 */
    private menuUI : ui.GameView.GameMenuUI;
    /**商店 ui*/
    private shopDoor : ui.topLeftUI;
    /**diolg */
    private shopDialog : ShopDialog;
    /**鼠标拖尾 */
    private mouseTail : Tail;
//-----------------------------------------------
    /**是否返回 主页面 否则返回选择关卡 */
    private isMain : boolean;
    /**是否按下 */
    private isMouseDown : boolean;
    /**是否开启超能力 */
    private isOpenSuper : boolean;
    /**是否是初始化 */
    private isReplay : boolean;
    /**是否被蜘蛛吃掉 */
    private isEated : boolean;
    /**是否已经融合，糖果合并 */
    private isToOne : boolean;
    //----------------------------------------------
    /**地图配置 */
    private mapConfig : Config.MapConfig;
    //hook 需要重置
    public arr_Hook:Array<Hook>=new Array<Hook>();
    //绳子  需要重置
    public arr_Rope : Array<Rope>;
    //绳子  碎糖果需要
    public arr_Rope2 : Array<Rope>;
    //糖果  不需要重置
    public candy : Candy;
    //糖果 碎了才需要
    public candy2 : Candy;
    //*怪物 */
    public monster : Monster;
    /**星星 */
    private arr_Star : Array<Star>;
    /**泡泡 */
    public arr_Balloon:Array<Balloon>;
    /**帽子 */
    public arr_MagicHat : Array<MagicHat>;
    /**锥子 */
    public arr_Knife:Array<Knife>;
    /**推力球 */
    public arr_ForceBall:Array<ForceBall>;
    /**激光 */
    public arr_Laser:Array<Laser>;
    /**蜘蛛 */
    public arr_Spider:Array<Spider>;
    //-------------------------------------------
    /**透明度转折变量 */
    private alphaZ : number = 0;
    /**鼠标检测修正 上一鼠标坐标 */
    private lastMousePos : any ;
    /**距离最远的绳子 */
    private maxLongRope : number;
    /**最远距离绳子下标 */
    private maxLongIndex : number;
    //-------------------------------------------
    /**关卡绳子记录 */
    private arr_RemRope : Array<any>;
    /**关卡绳子记录2 */
    private arr_RemRope2 : Array<any>;
    /**得分记录 */
    private score : number;
    /**屏幕高度 */
    private screenHeight : number;
    /**地图总长度 */
    private mapHight : number;
    /**地图总宽度 */
    private mapWidth : number;
    /**初始移动路径 */
    private screenRoad : Array<number>;
    /**路径下标 */
    private roadIndex : number;
    constructor(){super();}

    onEnable() : void
    {

    }

    onOpened(arr) : void
    {
        this.quarterIndex = arr[0];
        this.boxIndex = arr[1];
        this.cardIndex = arr[2];
        this.init();
    }
    
    private init() : void
    {
        ///物理线
        // Laya.PhysicsDebugDraw.enable();
        //舞台尺寸
        Laya.stage.width = 480;
        Laya.stage.height = 800;
        // ui初始化
        // ui初始化
        this.newShopUi();
        this.initBgSkin();
        this.menuUI = new ui.GameView.GameMenuUI();
        this.scene.addChild(this.menuUI);
        this.newDoorUi();
        this.doorOpen.alpha = 0.3;
        //鼠标拖尾初始化
        this.initMouseTail();

        //界面数据 数值初始化
        this.scene.img_replay.alpha = 0;
        this.alphaZ = 1;
        this.score = 0;
        this.roadIndex = 0;
        this.lastMousePos = {};
        this.isOpenSuper = false;
        this.isReplay = false;
        this.isEated = false;
        this.isToOne = false;
        Laya.Physics.I.gravity = {x:0,y:GameConfig.WOLDE_G};
        //界面 可视 初始化
        Laya.MouseManager.enabled = false;
        // this.doorOpen.ani1.play(0,false);
        this.menuUI.visible = false;
        /**屏幕适配 */
        this.gameShow();
        //添加事件
        this.addEvents();
        //第一次更新游戏
        this.UpdateData(this.quarterIndex+ "-" + this.boxIndex,this.cardIndex,true);
        //鼠标joint
        // let joint=new Laya.MouseJoint();
        // joint.maxForce=1000000;
        // this.candy.arr_Sp[0].addComponentIntance(joint);
    }

    /**屏幕适配 */
    private gameShow() : void
    {
        this.screenHeight = 480*(Laya.Browser.clientHeight/Laya.Browser.clientWidth);
        this.scene.img_gameBg.height =this.screenHeight;
        // this.scene.panel_GameWorld.height = this.screenHeight;
        this.scene.starAni.y = this.screenHeight - this.scene.starAni.height;      
    }

    private initBgSkin() : void
    {
        this.scene.img_gameBg.skin = "gameView/gameBg/boxBg_"+(this.boxIndex+1)+".png";
    }

    private newShopUi() {
        this.shopDoor = new ui.topLeftUI();
        this.shopDialog = Laya.WeakObject.I.get("dialog");
        this.scene.addChild(this.shopDoor);
        this.shopDoor.btn_Super.scale(0.7,0.7);
        this.shopDoor.btn_Teach.scale(0.7,0.7);
        this.shopDoor.btn_Teach.y -= 25;
        this.shopDoor.sho.scale(0.7,0.7);
        this.shopDoor.sho.y += 5;
        this.shopDoor.x = -8;
        this.shopDoor.y = 113;
        this.updateSuper();
    }

    private updateSuper () : void
    { 
        let playerData :PlayerData = PlayerData.ins;
        if(playerData.super > 0)
        {
            this.shopDoor.ani1.play(0,true);
        }
        else
        {
            this.shopDoor.sho.visible = false;
            this.shopDoor.ani1.stop();
        }
    }

    private newDoorUi() {
        if(!this.doorOpen)
        {
            this.doorOpen = new ui.GameView.GameViewDoorUI();
            this.scene.addChild(this.doorOpen);
        }
        let skins = Laya.WeakObject.I.get("boxSkin");
        this.doorOpen.img_doorL.skin = skins[this.quarterIndex + "-" + this.boxIndex][1];
        this.doorOpen.img_doorR.skin = skins[this.quarterIndex + "-" + this.boxIndex][1];
    }

    private initMouseTail() : void
    {
        this.mouseTail = new Tail(this.scene.panel_GameWorld);
        this.mouseTail.Init(0.5,1600);
        this.mouseTail.setSingle("cirle","gameView/mouseTail/tail1.png");
        this.mouseTail.start();
    }

   /**添加事件 */
   protected addEvents() : void
   {
       this.scene.btn_ReGame.on(Laya.Event.CLICK, this, this.onReGame);
       this.scene.btn_Menu.on(Laya.Event.CLICK, this, this.onMenu);

       this.menuUI.btn_Continue.on(Laya.Event.CLICK, this, this.onContinue);
       this.menuUI.btn_SelectRound.on(Laya.Event.CLICK, this, this.onSelectRound);
       this.menuUI.btn_Super.on(Laya.Event.CLICK, this, this.onShopSuper);
       this.menuUI.btn_MainMenu.on(Laya.Event.CLICK, this, this.onMainMenu);

       this.doorOpen.btn_Next.on(Laya.Event.CLICK, this, this.onNextRound);
       this.doorOpen.btn_Replay.on(Laya.Event.CLICK, this, this.onReplay);
       this.doorOpen.btn_ReturnRound.on(Laya.Event.CLICK, this, this.onSelectRound);

       this.shopDoor.btn_Teach.on(Laya.Event.CLICK,this,this.onTeach);
       this.shopDoor.btn_Super.on(Laya.Event.CLICK,this,this.onSuper);

       //
       Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);
       Laya.stage.on(Laya.Event.MOUSE_UP,this,this.onMouseUp);

       //按钮效果添加
       this.doorOpen.btn_Next.on(Laya.Event.MOUSE_DOWN, this, this.onBtn, ["down", this.doorOpen.btn_Next]);
       this.doorOpen.btn_Replay.on(Laya.Event.MOUSE_DOWN, this, this.onBtn, ["down", this.doorOpen.btn_Replay]);
       this.doorOpen.btn_ReturnRound.on(Laya.Event.MOUSE_DOWN, this, this.onBtn, ["down", this.doorOpen.btn_ReturnRound]);
       this.doorOpen.btn_Next.on(Laya.Event.MOUSE_OUT, this, this.onBtn, ["", this.doorOpen.btn_Next]);
       this.doorOpen.btn_Replay.on(Laya.Event.MOUSE_OUT, this, this.onBtn, ["", this.doorOpen.btn_Replay]);
       this.doorOpen.btn_ReturnRound.on(Laya.Event.MOUSE_OUT, this, this.onBtn, ["", this.doorOpen.btn_ReturnRound]);

       this.menuUI.btn_Continue.on(Laya.Event.MOUSE_DOWN, this, this.onBtn, ["down", this.menuUI.btn_Continue]);
       this.menuUI.btn_SelectRound.on(Laya.Event.MOUSE_DOWN, this, this.onBtn, ["down", this.menuUI.btn_SelectRound]);
       this.menuUI.btn_MainMenu.on(Laya.Event.MOUSE_DOWN, this, this.onBtn, ["down", this.menuUI.btn_MainMenu]);
       this.menuUI.btn_Continue.on(Laya.Event.MOUSE_OUT, this, this.onBtn, ["", this.menuUI.btn_Continue]);
       this.menuUI.btn_SelectRound.on(Laya.Event.MOUSE_OUT, this, this.onBtn, ["", this.menuUI.btn_SelectRound]);
       this.menuUI.btn_MainMenu.on(Laya.Event.MOUSE_OUT, this, this.onBtn, ["", this.menuUI.btn_MainMenu]);
       
       this.addAnimationOver();
   }

   /**str  down up */
   private onBtn(str,obj) : void
   {
      if(str == "down")
      {
         obj.skin = "publicAssets/btn2_1.png";
      }
      else
      {
         obj.skin = "publicAssets/btn_1.png";          
      }
   }

   /**需要销毁的事件 */
   private removeEvents() : void
   {
        Laya.timer.clear(this,this.ropeToCandy);
        Laya.timer.clear(this,this.mouseCute);
        Laya.timer.clear(this,this.candyTest);
        Laya.timer.clear(this,this.star_MoveBySelf);//清除星星的定时器
        this.arr_Rope.forEach(rope => {//取消绳子中的定时器
            rope.clearTimer();
        });
        if(this.arr_Rope2)
        {
            this.arr_Rope2.forEach(rope =>{
                rope.clearTimer(); 
            });
        }
        this.candy.clearTimer();//取消糖果中的定时器
        if(this.candy2) this.candy2.clearTimer();//取消糖果中的定时器
        if(this.arr_Balloon)//取消泡泡定时器
        {
            this.arr_Balloon.forEach(balloon=>{
                balloon.clearTimer();
            });
        }
        if(this.arr_Knife)//取消锥子定时器
        {
            this.arr_Knife.forEach(knife=>{
                knife.clearTimer();
                knife.destroy();
            });
        }
        if(this.arr_MagicHat)//取消帽子定时球
        {
            this.arr_MagicHat.forEach(magicHat => {
                magicHat.destroy();
                magicHat.clearTimer();
            })
        }
        if(this.arr_Hook)//hook销毁
        {
            this.arr_Hook.forEach(hook => {
                hook.hookDestroy();
            });
        }
        if(this.arr_ForceBall)//forceball销毁
        {
            this.arr_ForceBall.forEach(forceball => {
                forceball.removeEvent();
                forceball.destroy();
            });
        }
        if(this.arr_Laser)//laser销毁
        {
            this.arr_Laser.forEach(laser => {
                laser.clearTimer();
                laser.destroy();
            });
        }
        if(this.arr_Spider)//蜘蛛销毁
        {
            this.arr_Spider.forEach(spider =>{
                spider.clearTimer();
            });
        }
   }

    /**鼠标点下 */
    private onMouseDown() : void
    {
        this.isMouseDown = true;
    }
    /**鼠标抬起 */
    private onMouseUp() : void
    {
        this.isMouseDown = false;
        this.lastMousePos.x = null;
        this.lastMousePos.y = null;
    }

   private onTeach() :void
   {
        this.shopDialog.set(1,true);
   }

   private onSuper() :void
   {
        console.log("获得超能力");
        if(PlayerData.ins.super > 0)
        {
            PlayerData.ins.super -- ;
            this.isOpenSuper = true;
            this.updateSuper();
        }
        else
        {
            this.shopDialog.show();
            this.shopDialog.set(2,true);
        }
   }


   oncleic(e) : void
   {
    console.log(e.traget);
   }


    /**绑定动画完成 */
    private addAnimationOver() : void
    {
        this.doorOpen.ani5.on(Laya.Event.COMPLETE,this,this.doorAniEvent,[5]);
        this.doorOpen.ani4.on(Laya.Event.COMPLETE,this,this.doorAniEvent,[4]);  
        this.doorOpen.ani3.on(Laya.Event.COMPLETE,this,this.doorAniEvent,[3]);        
        this.doorOpen.ani2.on(Laya.Event.COMPLETE,this,this.doorAniEvent,[2]);
        this.doorOpen.ani1.on(Laya.Event.COMPLETE,this,this.doorAniEvent,[1]);
    }


    ////////////////////////////////////////////////////////////////////////////////////////事件处理
    /**开门动画完成处理时间 */
    private doorAniEvent(index) : void
    {
        switch(index)
        {
            case 1://用刀划开盒子
                this.afterCute();     
                this.scene.ani1.visible = false; 
                this.doorOpen.visible = false;//关闭动画层  
                Laya.MouseManager.enabled = true;                
                break;
            case 2://用胶带封住盒子
                this.closeDoor();
                this.scene.ani2.visible = false; 
                this.doorOpen.visible = false;//关闭动画层  
                break;
            case 3://吃到糖果显示计分板
                this.scene.ani3.visible = false; 
                Laya.MouseManager.enabled = true;
                break;
            case 4:
                this.scene.ani4.visible = false; 
                this.doorOpen.visible = false;//关闭动画层  
                
                break;
            case 5://重新开始 或者 下一关。关闭计分板 打开箱子操作
                this.scene.ani5.visible = false; 
                this.doorOpen.visible = false;//关闭动画层
                // this.doorOpen.visible = false;//关闭动画层                  
                break;
        }
   
    }

    /**事件 重玩 效果闪白光 ，重开*/
    private onReGame() : void
    {
        console.log("重玩");
        this.removeEvents();
        Laya.timer.loop(10,this,this.shooooo);
        this.score = 0;
        this.isEated = false;
        this.isToOne = false;
        this.isReplay = true;
        this.showSocre();
        this.UpdateData(this.quarterIndex + "-" + this.boxIndex,this.cardIndex,false);
        //禁止鼠标事件
        Laya.MouseManager.enabled = false;
        
    }

    /**白闪效果 */
    private shooooo() : void
    {
        if(this.scene.img_replay.alpha >=1)
        {
            this.alphaZ = -1
        }
        else if(this.scene.img_replay.alpha <=0)
        {
            if(this.alphaZ == -1) {Laya.timer.clear(this,this.shooooo);this.alphaZ=1;return;}
            this.alphaZ = 1;
        }
        this.scene.img_replay.alpha += this.alphaZ*0.01 + this.alphaZ*(1-this.scene.img_replay.alpha)/5;
    }

    /**事件 菜单 */
    private onMenu() : void
    {
        console.log("菜单");
        this.menuUI.visible = true;
    }

    /**事件 吃到糖果->下一关*/
    private onNextRound() : void
    {        
        this.removeEvents();
        this.score = 0;
        this.showSocre();
        //如果是最后一个关卡，跳到下一个盒子
        this.nextBox();
        /**需要初始化的数据 */
        this.DataInit();     
        this.UpdateData(this.quarterIndex + "-" + this.boxIndex,++this.cardIndex,false);
        this.doorOpen.ani1.gotoAndStop(0);
        // this.doorOpen.img_xiaodao.y = 850;
     }

     /**需要初始化的数据 */
    private DataInit() {
        this.arr_RemRope = undefined;
        this.arr_RemRope2 = undefined;
        this.isReplay = false;
        Laya.MouseManager.enabled = false;
        //设置是否被吃
        this.isEated = false;
        this.isToOne = false;        
        //开门动画可是
        this.doorOpen.visible = true;
        this.doorOpen.img_xiaodao.visible = true;
        //路径重置
        this.roadIndex = 0;
        //背景皮肤恢复
        this.scene.img_gameBg2.skin = "";
        this.scene.img_gameBg3.skin = "";
        //按钮状态初始化
        this.scene.doorOpen.btn_Next.skin = "publicAssets/btn_1.png";
    }

     /**如果是最后一个关卡，跳到下一个盒子 （未测试）*/
    private nextBox() 
    {
        if (this.cardIndex == 24) 
        {
            this.boxIndex++;
            this.cardIndex = -1;
            if (this.boxIndex == 4) 
            {
                this.quarterIndex++;
                this.boxIndex = 0;
            }
            if (this.quarterIndex == 2) 
            {
                //通关逻辑
            }
        }
    }

    /**事件 吃到糖果->重玩  效果开门重开 */
    private onReplay() : void
    {
        console.log("重玩  效果开门重开");
        this.removeEvents();
        this.showSocre();
        Laya.MouseManager.enabled = false;  
        this.score = 0;
        this.doorOpen.visible = true;     
        this.isReplay = true;      
        this.isEated = false; 
        this.isToOne = false;                
        this.doorOpen.ani4.play(0,false);
        // this.doorOpen.img_xiaodao.y = 840;
        this.UpdateData(this.quarterIndex + "-" + this.boxIndex,this.cardIndex,false);
        
    }
    /**事件 继续游戏 */
    private onContinue() : void
    {
        this.menuUI.visible = false;
        //开始游戏
    }

    /**事件 选择关卡*/
    private onSelectRound() : void
    {
        //选择关卡
        this.isMain = false;       
        this.doorOpen.visible = true;
        // this.doorOpen.ani2.gotoAndStop(25);    
        this.doorOpen.img_xiaodao.visible = false;  
        this.doorOpen.ani2.play(25,false);
        // GameManager.ins_.getMediator(GameData.SELECT_ROUND_MEDIATOR).runRound();
    }

    /**事件 主界面 */
    private onMainMenu() : void
    {
        //跳到主界面    
        this.isMain = true;        
        this.doorOpen.visible = true;        
        this.doorOpen.ani2.play(0,false);      
        this.doorOpen.img_xiaodao.visible = false;  
        
            
        // GameManager.ins_.getMediator(GameData.START_GAME_MEDIATOR).runRound();        
    }

    /**事件 超能力获取 */
    private onShopSuper() : void
    {
        console.log("获得超能力");
        if(PlayerData.ins.super > 0)
        {
            PlayerData.ins.super -- ;
            this.isOpenSuper = true;
        }
        else
        {
            this.shopDialog.show();
        }
    }

    /**退出游戏界面 */
    protected exitGame() : void
    {
        // this.dispose();
    }
/////////////////////////////////////////////////////////////////////////////状态处理

    /**用刀划开盒子后 */
    private afterCute() : void
    {
           
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);		
		Laya.stage.on(Laya.Event.MOUSE_UP,this,this.onMouseUp); 
    }

    /**用胶带封住盒子后*/
    private closeDoor() : void
    {
        if(this.isMain)
        {   
            Laya.Scene.open("StartGame.scene"); 
        }
        else
        {
            Laya.Scene.open("SelectRound/SelectRound.scene",true,[this.quarterIndex,this.boxIndex]); 
        }
        //舞台尺寸
        Laya.stage.width = 750;
        Laya.stage.height = 1334;
    }

    /**吃到糖果显示计分面板 */
    private showSocreMenu() : void
    {
        let door = this.doorOpen;
        let str = "";
        door.img_star1.skin = "gameView/gameDoor/noStar.png";
        door.img_star2.skin = "gameView/gameDoor/noStar.png";
        door.img_star3.skin = "gameView/gameDoor/noStar.png";        
        switch(this.score)
        {
            case 0: str = "菜鸡";
                break;
            case 1: str = "可怜一颗星";
                door.img_star1.skin = "gameView/gameDoor/getStar.png"; 
                break;
            case 2: str = "中规中矩";
                door.img_star1.skin = "gameView/gameDoor/getStar.png"; 
                door.img_star3.skin = "gameView/gameDoor/getStar.png"; 
                break;
            case 3: str = "超级厉害";
                door.img_star1.skin = "gameView/gameDoor/getStar.png"; 
                door.img_star3.skin = "gameView/gameDoor/getStar.png"; 
                door.img_star2.skin = "gameView/gameDoor/getStar.png"; 
                break;
            default:
                console.error("没有这个分数");
        }
        door.lab_Content.text = str;
    }

    /**吃到星星数量 */
    private showSocre() : void
    {
        switch(this.score)
        {
            case 0:this.scene.ani1.gotoAndStop(0);this.scene.ani2.gotoAndStop(0);this.scene.ani3.gotoAndStop(0);break;
            case 1:this.scene.ani1.play(0,false);break;
            case 2:this.scene.ani2.play(0,false);break;
            case 3:this.scene.ani3.play(0,false);break;

        }
    }

////////////////////////////////////////////////界面逻辑处理
    private UpdateData(mapWhere:string,mapId:number,isNew:boolean) : void
    {
        Laya.Physics.enable({allowSleeping:true,gravity:12});
        // Laya.PhysicsDebugDraw.enable();
        this.mapConfig = Config.ConfigManger.ins.getMapConfig(mapWhere,mapId);
        if(!this.mapConfig)
        {
            alert("关卡为配置，请配置后再调试");
            Laya.stage.height = 1334;
            Laya.stage.width = 750;
            Laya.Scene.open("SelectRound/SelectRound.scene",true,[this.quarterIndex,this.boxIndex]); 
        }
        console.log(this.mapConfig);

        //背景初始化
        this.setBackground(this.mapConfig.arr_MapSkin,this.mapConfig.arr_MapSkinPos,this.mapConfig.screenRoad);
        //怪物初始化
        this.monsterInit(this.mapConfig.monster);
        //钩子
        this.hookInit(this.mapConfig.arr_Hook);
        //绳子数据初始化
        this.ropeInit(this.mapConfig.arr_Rope,this.mapConfig.arr_Rope2,this.arr_Hook);
        //星星数据初始化
        this.starInit(this.mapConfig.arr_Star);
        //糖果数据初始化
        this.candyInit(this.mapConfig.candyConfig,this.mapConfig.candyConfig2,this.mapConfig.arr_Rope.length,this.mapConfig.arr_Knife,this.mapConfig.arr_Laser);
        //泡泡数据初始化
        this.balloonInit(this.mapConfig.arr_Balloon);
        //帽子数据初始化
        this.magicHatInit(this.mapConfig.arr_MagicHat); 
        //锥子数据初始化
        this.knifeInit(this.mapConfig.arr_Knife);
        //蜘蛛数据初始化
        this.spiderInit(this.mapConfig.arr_Spider);
        //推力球数据初始化
        this.forceBallInit(this.mapConfig.arr_Forceball);
        //初始化开门动画
        this.openDoorInit(this.mapConfig.arr_Rope,this.mapConfig.arr_Rope2);
        //激光数据初始化
        this.laserInit(this.mapConfig.arr_Laser);
        //绳子寻找糖果
        Laya.timer.loop(1,this,this.ropeToCandy);
        //绳子寻找破碎糖果
        if(this.candy2) Laya.timer.loop(1,this,this.ropeToCandy2);        
        //割绳检测
        Laya.timer.loop(16,this,this.mouseCute);
        //糖果检测 
        Laya.timer.loop(1,this,this.candyTest);
        
    }

    /***场景初始化*/
    private setBackground(arr_MapSkin,arr_MapSkinPos,screenRoad) : void
    {
        if(!this.screenRoad)
            this.screenRoad = [];
        this.screenRoad = screenRoad;
        //滚动设置
        this.scene.panel_GameWorld.y = 0;
        let bi = this.screenHeight/800;
        //创建数组 装上img
        let arr_Bg : Array<any> = [];
        arr_Bg[0] = this.scene.img_gameBg;
        arr_Bg[1] = this.scene.img_gameBg2;
        arr_Bg[2] = this.scene.img_gameBg3;
        for(let i=0;i<arr_MapSkin.length;i++)
        {
            if(i == 0) {
                this.scene.img_gameBg.skin = "gameView/gameBg/boxBg_"+(this.boxIndex+1)+".png"; 
                continue;
            }        
            if(arr_MapSkinPos[i].height)
            {
                arr_Bg[i].height = arr_MapSkinPos[i].height;
            }
            if(arr_MapSkinPos[i].width)
            {
                arr_Bg[i].width = arr_MapSkinPos[i].width;
            }
            //设置皮肤
            arr_Bg[i].skin = arr_MapSkin[i];   
            arr_Bg[i].height = arr_MapSkinPos[i].height * bi;
            //位置设置
            arr_Bg[i].x = arr_MapSkinPos[i].x;  
            arr_Bg[i].y = arr_MapSkinPos[i].y * bi;
            if(arr_Bg[i].x == arr_Bg[i-1].x)
            {//竖
                arr_Bg[i].width = arr_Bg[i-1].width;
            }
            else
            {//横
                arr_Bg[i].height = this.screenHeight;
            }
        }
        //地图高度初始化
        this.mapHight = this.screenHeight;
        //地图宽度初始化
        this.mapWidth = 480;
        if(arr_MapSkin.length>=2)
        {
            //获取地图总高
            this.mapHight = arr_Bg[arr_Bg.length - 1].y + arr_Bg[arr_Bg.length - 1].height;
            //获取地图总宽
            this.mapWidth = arr_Bg[arr_Bg.length - 1].x + arr_Bg[arr_Bg.length - 1].width;

            
        }
        //sprite 高度
        this.scene.panel_GameWorld.height = this.mapHight;
        //屏幕位置初始化
        this.initMapPos();
        //如果地图的皮肤大于1 开始滚动
        this.newDoorUi();
    }
    /**屏幕位置初始化 */
    private initMapPos() : void
    {
        if(this.screenRoad)
        {
        if(this.mapHight> this.screenHeight)
            this.scene.panel_GameWorld.y = -this.screenRoad[this.roadIndex];
        if(this.mapWidth > 480)
            this.scene.panel_GameWorld.x = -this.screenRoad[this.roadIndex];
        }
        else
        {
            this.scene.panel_GameWorld.y = 0;
            this.scene.panel_GameWorld.x = 0;
        }
    }
    
    /**背景移动 */
    private runBg() : void
    {
        //是否可运动    
        if(!this.screenRoad[this.roadIndex+1] && this.screenRoad[this.roadIndex] == 0) 
        {
            Laya.timer.clear(this,this.runBg);
            return;
        } 
        //获取方向
        let  Ca= this.screenRoad[this.roadIndex+1] - this.screenRoad[this.roadIndex];
        Ca = -Ca/400;

        
        //竖排
        if(this.mapHight > this.screenHeight)
        {
            this.scene.panel_GameWorld.y += Ca;
            if(this.scene.panel_GameWorld.y < -this.screenRoad[this.roadIndex+1]+10 && this.scene.panel_GameWorld.y > -this.screenRoad[this.roadIndex+1] -10)
            {//检测到到达目标点
                this.roadIndex++;
                if(!this.screenRoad[this.roadIndex+1])
                {
                    Laya.MouseManager.enabled = true;
                    Laya.timer.clear(this,this.runBg);
                    Laya.timer.loop(1,this,this.followCandy,[90]);
                    //一出现就在线上的蜘蛛
                    this.spiderMove();
                    //星星是否开始计时
                    this.arr_Star.forEach(star => {
                        star.startToCount(); 
                    });
                    //开启鼠标事件
                    return;
                }
            }
        }
        //横排
        if(this.mapWidth > 480)
        {
            this.scene.panel_GameWorld.x += Ca;
            if(this.scene.panel_GameWorld.x < -this.screenRoad[this.roadIndex+1]+10 && this.scene.panel_GameWorld.x > -this.screenRoad[this.roadIndex+1])
            {//检测到到达目标点
                this.roadIndex++;
                if(!this.screenRoad[this.roadIndex+1])
                {
                    Laya.MouseManager.enabled = true;
                    Laya.timer.clear(this,this.runBg);
                    //蜘蛛
                    this.spiderMove();
                    Laya.timer.loop(1,this,this.followCandy,[0]);
                    //星星是否开始计时
                    this.arr_Star.forEach(star => {
                        star.startToCount(); 
                    });
                    //开启鼠标事件
                    return;
                }
            }
        }
        //同步移动
        this.moveTogether();

    }
    private spiderMove() {
        if(this.mapConfig.arr_Spider.length == 0) return;
        if (this.arr_Spider) {
            this.arr_Spider.forEach(spider => {
                if (spider.candy)
                    spider.moveStart();
            });
        }
    }
    /**跟踪糖果 */
    private followCandy(rotation) : void
    {
        let candyPosValue;
        let followValue;
        if(rotation == 0)
        {//水平
            candyPosValue = this.candy.arr_Sp[0].x;
            followValue = 480/2;
            this.mouseTail.setPosX(+this.scene.panel_GameWorld.x,0);             
        }   
        else
        {//竖直
            this.mouseTail.setPosX(0,-this.scene.panel_GameWorld.y);
            candyPosValue = this.candy.arr_Sp[0].y;
            followValue = this.screenHeight/2;
        }
        //**设置位置差 拖尾 */
        //跟随    0     
        if(rotation == 90 && candyPosValue>followValue && candyPosValue<this.mapHight-followValue)
        {
            this.scene.panel_GameWorld.y -= candyPosValue-followValue + this.scene.panel_GameWorld.y;
            if(this.mapHight + this.scene.panel_GameWorld.y <= this.screenHeight )
            {
                Laya.timer.clear(this,this.followCandy);
            }
            this.moveTogether();
        }
                //跟随 90
        //跟随         
        if (rotation == 0 && candyPosValue > followValue && candyPosValue < this.mapWidth - followValue)  
        {
            this.scene.panel_GameWorld.x -= candyPosValue - followValue + this.scene.panel_GameWorld.x;
            if (this.mapWidth + this.scene.panel_GameWorld.x <= 480)  
            {
                Laya.timer.clear(this, this.followCandy);
            }
            this.moveTogether();
        }

        
    }
    /**绳子寻找破碎糖果**/
    private ropeToCandy2() : void
    {
        let obj : any = {};
        let rope : Rope;
        let add = 0;
        let speContorl = 1;
        let dic;
        let speed  : number =  GameConfig.ROPE_TO_CANDY_SPEED ;
        for(let i=0;i<this.arr_Rope2.length;i++)
        {
            rope = this.arr_Rope2[i];
            dic = Math.sqrt(Math.pow(rope.ropePointsArray[rope.ropePointsArray.length-1].sp.x - this.candy2.getCandySprite(0).x,2) + Math.pow(rope.ropePointsArray[rope.ropePointsArray.length-1].sp.y - this.candy2.getCandySprite(0).y,2));
            if(rope.ropePointsArray[1].style == "hook3")
            {//弹性绳子
                if(dic < 200)
                {//进入加速范围
                    speContorl = 0.1;
                }       
                speed = GameConfig.ROPE_JUMP__TO_CANDY_SPEED; 
            }
            obj.x = speed/speContorl * this.rotationDeal(rope.ropePointsArray[rope.ropePointsArray.length-1].sp.x,rope.ropePointsArray[rope.ropePointsArray.length-1].sp.y,this.candy2.getCandySprite(0).x,this.candy2.getCandySprite(0).y,"cos");
            obj.y = speed/speContorl * this.rotationDeal(rope.ropePointsArray[rope.ropePointsArray.length-1].sp.x,rope.ropePointsArray[rope.ropePointsArray.length-1].sp.y,this.candy2.getCandySprite(0).x,this.candy2.getCandySprite(0).y,"sin");
            
            rope.ropePointsArray[rope.ropePointsArray.length-1].body.setVelocity(obj);
            // rope.ropePointsArray[rope.ropePointsArray.length - 1].body.applyForceToCenter({x:obj.x,y:obj.y});
            if(dic < 15)
            {
                add++;
            } 
            speContorl = 1;
        }
        //检测绳子是否全部帮上    
        if(add == this.arr_Rope2.length)
        {
            Laya.timer.clear(this,this.ropeToCandy2);
            //连接糖果
            for(let i=0;i<this.arr_Rope2.length;i++)
            {
                
                this.arr_Rope2[i].connectCandy(this.candy2,i);
                this.arr_Rope2[i].ropePointsArray[this.arr_Rope2.length - 1].sp.getComponents(Laya.RigidBody)[0].setVelocity({x:0,y:0});
                if(this.arr_Spider)
                {
                     this.arr_Spider.forEach(spider => {
                         if(spider.sp.x <= this.arr_Rope2[i].ropePointsArray[0].sp.x+1&&spider.sp.x >= this.arr_Rope2[i].ropePointsArray[0].sp.x-1 && spider.sp.y >= this.arr_Rope2[i].ropePointsArray[0].sp.y-1 && spider.sp.y <= this.arr_Rope2[i].ropePointsArray[0].sp.y+1)
                         {
                             if(!spider.candy)
                                 spider.foundCandy(this.arr_Rope2[i],this.candy2,true);
                             else
                             {
                                 spider.foundCandy(this.arr_Rope2[i],this.candy2,false);                            
                             }
                         }   
                     });
                }
             }
             this.candy2.set("useg");
            //获取记录位置信息
            for(let z=0 ;z <this.arr_Rope2.length;z++)
            {
                if(this.arr_RemRope2 === undefined) 
                {
                    this.arr_RemRope2 = new Array<any>();
                }
                this.arr_RemRope2.push(this.arr_Rope2[z].getRemRope());
            }
        }
                
    }
   /**ropeToCandy */
   private ropeToCandy() : void
   {
       let obj : any = {};
       let rope : Rope;
       let add = 0;
       let speContorl = 1;
       let dic;
       let speed  : number =  GameConfig.ROPE_TO_CANDY_SPEED ;
       for(let i=0;i<this.arr_Rope.length;i++)
       {
           rope = this.arr_Rope[i];
           dic = Math.sqrt(Math.pow(rope.ropePointsArray[rope.ropePointsArray.length-1].sp.x - this.candy.getCandySprite(0).x,2) + Math.pow(rope.ropePointsArray[rope.ropePointsArray.length-1].sp.y - this.candy.getCandySprite(0).y,2));
           if(rope.ropePointsArray[1].style == "hook3")
           {//弹性绳子
               if(dic < 200)
               {//进入加速范围
                   speContorl = 0.1;
               }       
               speed = GameConfig.ROPE_JUMP__TO_CANDY_SPEED; 
           }
           obj.x = speed/speContorl * this.rotationDeal(rope.ropePointsArray[rope.ropePointsArray.length-1].sp.x,rope.ropePointsArray[rope.ropePointsArray.length-1].sp.y,this.candy.getCandySprite(0).x,this.candy.getCandySprite(0).y,"cos");
           obj.y = speed/speContorl * this.rotationDeal(rope.ropePointsArray[rope.ropePointsArray.length-1].sp.x,rope.ropePointsArray[rope.ropePointsArray.length-1].sp.y,this.candy.getCandySprite(0).x,this.candy.getCandySprite(0).y,"sin");
           
           rope.ropePointsArray[rope.ropePointsArray.length-1].body.setVelocity(obj);
           // rope.ropePointsArray[rope.ropePointsArray.length - 1].body.applyForceToCenter({x:obj.x,y:obj.y});
           if(dic < 15)
           {
               add++;
           } 
           speContorl = 1;
           ///////////////开门等待
           if(i == this.maxLongIndex)
           {
               this.doorOpen.img_xiaodao.y = (this.screenHeight+100) * dic/this.maxLongRope - 339;
           }
       }
       //检测绳子是否全部帮上    
       if(add == this.arr_Rope.length)
       {
           Laya.timer.clear(this,this.ropeToCandy);
           //连接糖果
           for(let i=0;i<this.arr_Rope.length;i++)
           {
               
               this.arr_Rope[i].connectCandy(this.candy,i);
               this.arr_Rope[i].ropePointsArray[this.arr_Rope.length - 1].sp.getComponents(Laya.RigidBody)[0].setVelocity({x:0,y:0});
               if(this.arr_Spider)
               {
                    this.arr_Spider.forEach(spider => {
                        if(spider.sp.x <= this.arr_Rope[i].ropePointsArray[0].sp.x+1&&spider.sp.x >= this.arr_Rope[i].ropePointsArray[0].sp.x-1 && spider.sp.y >= this.arr_Rope[i].ropePointsArray[0].sp.y-1 && spider.sp.y <= this.arr_Rope[i].ropePointsArray[0].sp.y+1)
                        {
                            if(!spider.candy)
                                spider.foundCandy(this.arr_Rope[i],this.candy,true);
                            else
                            {
                                spider.foundCandy(this.arr_Rope[i],this.candy,false);                            
                            }
                        }   
                    });
               }
            }
            this.candy.set("useg");
           //获取记录位置信息
           for(let z=0 ;z <this.arr_Rope.length;z++)
           {
               if(this.arr_RemRope === undefined) 
               {
                   this.arr_RemRope = new Array<any>();
               }
               this.arr_RemRope.push(this.arr_Rope[z].getRemRope());
           }
           //开门动画处理
           // if(this.isInit)
           if(!this.isReplay)
           {
               if(this.doorOpen.img_xiaodao.y > -200)
               {
                   // this.doorOpen.img_xiaodao.visible = true;
                   let num = this.doorOpen.img_xiaodao.y + 339;
                   num = num/15;
                   Laya.timer.loop(50,this,this.openDoorDeal,[num]);
               }
               else
               {
                   this.openDoorEnd();
               }
           }
           else
           {
               //开启鼠标事件
               Laya.MouseManager.enabled = true;
           }
       }
       
   }
   
    private openDoorDeal(num) 
    {
        this.doorOpen.img_xiaodao.y += -num;
        if(this.doorOpen.img_xiaodao.y <-330)
        {
            this.openDoorEnd();
            Laya.timer.clear(this,this.openDoorDeal);
        }
    }

    private openDoorEnd() 
    {
        this.doorOpen.visible = true;
        this.doorOpen.ani1.play(0, false);
        this.doorOpen.img_xiaodao.y = -339;
        this.doorOpen.img_xiaodao.visible = false;
        // Laya.MouseManager.enabled = true;
        if(this.mapHight > this.screenHeight || this.mapWidth > 480)
        {
            //关闭鼠标事件
            Laya.MouseManager.enabled = false;
            Laya.timer.loop(1,this,this.runBg);
            return;
        }
        //一出现就在线上的蜘蛛
        this.spiderMove();
        //星星是否运动
        this.arr_Star.forEach(star => {
           star.startToCount(); 
        });

    }

    /**开门动画初始化 */
    private openDoorInit(arr_Rope,arr_Rope2) : void
    {// TO DO
        this.maxLongIndex = 0;
        this.maxLongRope = Math.sqrt(Math.pow(this.arr_Rope[0].ropePointsArray[this.arr_Rope[0].ropePointsArray.length-1].sp.x - this.candy.getCandySprite(0).x,2) + Math.pow(this.arr_Rope[0].ropePointsArray[this.arr_Rope[0].ropePointsArray.length-1].sp.y - this.candy.getCandySprite(0).y,2));
        for(let i=0;i<arr_Rope.length;i++)
        {
            let dic = Math.sqrt(Math.pow(this.arr_Rope[i].ropePointsArray[this.arr_Rope[i].ropePointsArray.length-1].sp.x - this.candy.getCandySprite(0).x,2) + Math.pow(this.arr_Rope[i].ropePointsArray[this.arr_Rope[i].ropePointsArray.length-1].sp.y - this.candy.getCandySprite(0).y,2));
            if(this.maxLongRope < dic)
            {
                this.maxLongIndex = i;
                this.maxLongRope = dic;
            }
        }    
    }

  /**蜘蛛数据初始化 */
  private spiderInit(arr_Spider) : void
  {
     if(!arr_Spider[0]) return;
      if(this.arr_Spider ==undefined)
          this.arr_Spider = new Array<Spider>();
      for(let i=0;i<arr_Spider.length;i++)
      {
          if(this.arr_Spider[i])
          {
              this.arr_Spider[i].update({"spider_X":arr_Spider[i].spider_X,"spider_Y":arr_Spider[i].spider_Y});
          }
          else
          {
              this.arr_Spider[i] = new Spider(this.scene.panel_GameWorld);
              this.arr_Spider[i].init({"spider_X":arr_Spider[i].spider_X,"spider_Y":arr_Spider[i].spider_Y},this,this.failGame);
          }
          // 
      }
      console.log(this.arr_Spider);
      
  }

    /**星星初始化 */
    private starInit(starConfig) : void
    {
        if(this.arr_Star === undefined)
            this.arr_Star = new Array<Star>();
            let moveArray:Array<Star>=new Array<Star>();
            let configArray:Array<Star>=new Array<any>();
            for(let i=0;i<3;i++)
            {
                if(this.arr_Star[i])
                {
                    this.arr_Star[i].update(starConfig[i]);
                    if(starConfig[i].move[0]){
                        starConfig[i].star_X=this.arr_Star[i].sp.x;
                        starConfig[i].star_Y=this.arr_Star[i].sp.y;
                        this.arr_Star[i].isGoing=true;
                        moveArray.push(this.arr_Star[i]);
                        configArray.push(starConfig[i]);
                    }
                }
                else
                {
                    this.arr_Star[i] = new Star(this.scene.panel_GameWorld);
                    this.arr_Star[i].init(starConfig[i]); 
                    if(starConfig[i].move[0]){
                        starConfig[i].star_X=this.arr_Star[i].sp.x;
                        starConfig[i].star_Y=this.arr_Star[i].sp.y;
                        this.arr_Star[i].isGoing=true;
                        moveArray.push(this.arr_Star[i]);
                        configArray.push(starConfig[i]);
                    }               
                }
            }
            if(moveArray[0]){
                Laya.timer.frameLoop(1,this,this.star_MoveBySelf,[moveArray,configArray]);
            }
            
    }

    /**怪物数据初始化 */
    private monsterInit(monsterConfig) : void
    {
        if(this.monster)
        {
            this.monster.update(monsterConfig);
        }
        else
        {
            this.monster = new Monster(monsterConfig,this.scene.panel_GameWorld);
        }
        this.scene.gamePos.x =  this.monster.sp.x;
        this.scene.gamePos.y =  this.monster.sp.y;
        this.scene.gamePos.skin = "gameView/gamePos/pos" +(this.boxIndex + 1)+ ".png";
    }
    
    /**糖果数据初始化 */
    private candyInit(candyConfig,candyConfig2,num,arr_Knife,arr_Laser) : void
    {
        if(!this.candy) 
        {
            this.candy = new Candy(this.scene.panel_GameWorld);
            this.candy.init({"x":candyConfig.candy_X,"y":candyConfig.candy_Y,"style":candyConfig.style},num);
            /**-------是否初始化糖果碎片----- */
            if(arr_Knife[0]||arr_Laser[0]){
                this.candy.createCandyApart();
            }
        }
        else
        {
            this.candy.update({"x":candyConfig.candy_X,"y":candyConfig.candy_Y,"style":candyConfig.style},num);
            /**-------是否初始化糖果碎片----- */
            if(arr_Knife[0]||arr_Laser[0]){
                this.candy.createCandyApart();
            }
        }
        ////////////第二个糖果初始化
        if(!candyConfig2) {this.isToOne = true;return;}//没有糖果二，就默认为已经融合了。
        if(!this.candy2) 
        {
            this.candy2 = new Candy(this.scene.panel_GameWorld);
            this.candy2.init({"x":candyConfig2.candy_X,"y":candyConfig2.candy_Y,"style":candyConfig2.style},num);
            /**-------是否初始化糖果碎片----- */
            if(arr_Knife[0]||arr_Laser[0]){
                this.candy2.createCandyApart();
            }
        }
        else
        {
            this.candy2.update({"x":candyConfig2.candy_X,"y":candyConfig2.candy_Y,"style":candyConfig2.style},num);
            /**-------是否初始化糖果碎片----- */
            if(arr_Knife[0]||arr_Laser[0]){
                this.candy2.createCandyApart();
            }
        }
        // Laya.timer.loop(500,this,function(){
        //     console.log(this.candy.arr_Sp[0].x + " , " + this.candy.arr_Sp[0].y );
        //     console.log(this.candy.arr_Sp[0].parent);
        // });
    }

    
    /**钩子数据初始化 */
    private hookInit(arr_Hook) : void
    {
        if(this.arr_Hook === undefined)
            this.arr_Hook = new Array<Hook>();
        for(let i=0;i<arr_Hook.length;i++)
        {
            if(this.arr_Hook[i])
            {
                this.arr_Hook[i].update({"hook_X":arr_Hook[i].hook_X,"hook_Y":arr_Hook[i].hook_Y,"style":arr_Hook[i].style,"rotation":arr_Hook[i].rotation,"length":arr_Hook[i].length,"percent":arr_Hook[i].percent},arr_Hook[i].size);
            }
            else
            {
                this.arr_Hook[i] = new Hook(this.scene.panel_GameWorld);
                this.arr_Hook[i].init({"hook_X":arr_Hook[i].hook_X,"hook_Y":arr_Hook[i].hook_Y,"style":arr_Hook[i].style,"rotation":arr_Hook[i].rotation,"length":arr_Hook[i].length,"percent":arr_Hook[i].percent},arr_Hook[i].size);
            }
        }
        console.log(this.arr_Hook);
        
    }
    
    /**绳子数据初始化 */
    private ropeInit(arr_Rope,arr_Rope2,arr_Hook) : void
    {
        let rope : Rope;
        let hIndex : number; 
        this.arr_Rope = new Array<Rope>();
        ///普通rope
        for(let i=0; i<arr_Rope.length; i++)
        {
            rope = new Rope(this.scene.panel_GameWorld);
            if(this.arr_RemRope === undefined || this.arr_Hook[arr_Rope[i].hookIndex].style == "hook3")
            {
                rope.setHookIndex(arr_Rope[i].hookIndex);//铆钉节点
                rope.init(arr_Hook[rope.hookIndex].hook_X,arr_Hook[rope.hookIndex].hook_Y,arr_Rope[i].num,arr_Hook[rope.hookIndex].style);
            }
            else
            {
                //TO DO
                rope.rePlay(this.arr_RemRope[i],arr_Hook[arr_Rope[i].hookIndex].style);
            }
            this.arr_Rope.push(rope);
            // rope.ropePointsArray[0].isCanMove(arr_Hook[i]);
        }
        ///碎糖果需求的绳子
        if(arr_Rope2)
        {
            this.arr_Rope2 = new Array<Rope>();
            for(let i=0; i<arr_Rope2.length; i++)
            {
            rope = new Rope(this.scene.panel_GameWorld);
            if(this.arr_RemRope2 === undefined|| this.arr_Hook[arr_Rope2[i].hookIndex].style == "hook3")
            {
                rope.setHookIndex(arr_Rope2[i].hookIndex);
                rope.init(arr_Hook[rope.hookIndex].hook_X,arr_Hook[rope.hookIndex].hook_Y,arr_Rope2[i].num,arr_Hook[rope.hookIndex].style);
            }
            else
            {
                rope.rePlay(this.arr_RemRope2[i],arr_Hook[arr_Rope2[i].hookIndex].style);
            }
            this.arr_Rope2.push(rope);
            }
        }
        //滑动条需要绑定绳子
        for(let i = 0; i< arr_Rope.length;i++)
        {
            
            if(this.arr_Hook[i].length)
            {
                this.arr_Hook[i].setRopePoint(this.arr_Rope[i].ropePointsArray[0]);
            }
        }
        for(let i = 0; i< arr_Rope2.length;i++)
        {
            if(this.arr_Hook[i].length)
            {
                this.arr_Hook[i].setRopePoint(this.arr_Rope2[i].ropePointsArray[0]);
            }
        }
        
    }

    /**泡泡数据初始化 */
    private balloonInit(arr_Balloon) : void
    {
        if(!arr_Balloon[0]) return;        
        if(this.arr_Balloon  == undefined)
            this.arr_Balloon = new Array<Balloon>();
        for(let i=0;i<arr_Balloon.length;i++)
        {
            if(this.arr_Balloon[i])
            {
                this.arr_Balloon[i].update({"balloon_X":arr_Balloon[i].balloon_X,"balloon_Y":arr_Balloon[i].balloon_Y});
            }
            else
            {
                this.arr_Balloon[i] = new Balloon(this.scene.panel_GameWorld);
                this.arr_Balloon[i].init({"balloon_X":arr_Balloon[i].balloon_X,"balloon_Y":arr_Balloon[i].balloon_Y});                
            }
        }
        console.log(this.arr_Balloon);
        
    }

     /**锥子数据初始化 */
     private knifeInit(arr_Knife) : void
     {
        if(!arr_Knife[0]) return;
         if(this.arr_Knife ==undefined)
             this.arr_Knife = new Array<Knife>();
         for(let i=0;i<arr_Knife.length;i++)
         {
             if(this.arr_Knife[i])
             {
                 this.arr_Knife[i].update({"knife_X":arr_Knife[i].knife_X,"knife_Y":arr_Knife[i].knife_Y,"style":arr_Knife[i].style,"rotation":arr_Knife[i].rotation,"v":arr_Knife[i].v,"move":arr_Knife[i].move});
             }
             else
             {
                 this.arr_Knife[i] = new Knife(this.scene.panel_GameWorld);
                 this.arr_Knife[i].init({"knife_X":arr_Knife[i].knife_X,"knife_Y":arr_Knife[i].knife_Y,"style":arr_Knife[i].style,"rotation":arr_Knife[i].rotation,"v":arr_Knife[i].v,"move":arr_Knife[i].move});
             }
         }
         console.log(this.arr_Knife);
         
     }

     /**推力球数据初始化 */
    private forceBallInit(arr_ForceBall) : void
    {
        if(!arr_ForceBall[0]) return;
        if(this.arr_ForceBall == undefined)
            this.arr_ForceBall = new Array<ForceBall>();
        for(let i=0;i<arr_ForceBall.length;i++)
        {
            if(this.arr_ForceBall[i])
            {
                this.arr_ForceBall[i].update({"forceball_X":arr_ForceBall[i].forceball_X,"forceball_Y":arr_ForceBall[i].forceball_Y,"rotation":arr_ForceBall[i].rotation});
                this.arr_ForceBall[i].sp.on(Laya.Event.MOUSE_DOWN,this.arr_ForceBall[i],this.arr_ForceBall[i].forceball_applyForce,[this.candy,this.arr_Balloon]);
            }
            else
            {
                this.arr_ForceBall[i] = new ForceBall(this.scene.panel_GameWorld);
                this.arr_ForceBall[i].init({"forceball_X":arr_ForceBall[i].forceball_X,"forceball_Y":arr_ForceBall[i].forceball_Y,"rotation":arr_ForceBall[i].rotation});
                this.arr_ForceBall[i].sp.on(Laya.Event.MOUSE_DOWN,this.arr_ForceBall[i],this.arr_ForceBall[i].forceball_applyForce,[this.candy,this.arr_Balloon]);
            }
            //碎糖果的推力球注册
            if(!this.candy2) continue;
            if(this.arr_ForceBall[i])
            {
                this.arr_ForceBall[i].update({"forceball_X":arr_ForceBall[i].forceball_X,"forceball_Y":arr_ForceBall[i].forceball_Y,"rotation":arr_ForceBall[i].rotation});
                this.arr_ForceBall[i].sp.on(Laya.Event.MOUSE_DOWN,this.arr_ForceBall[i],this.arr_ForceBall[i].forceball_applyForce,[this.candy2,this.arr_Balloon]);
            }
            else
            {
                this.arr_ForceBall[i] = new ForceBall(this.scene.panel_GameWorld);
                this.arr_ForceBall[i].init({"forceball_X":arr_ForceBall[i].forceball_X,"forceball_Y":arr_ForceBall[i].forceball_Y,"rotation":arr_ForceBall[i].rotation});
                this.arr_ForceBall[i].sp.on(Laya.Event.MOUSE_DOWN,this.arr_ForceBall[i],this.arr_ForceBall[i].forceball_applyForce,[this.candy2,this.arr_Balloon]);
            }
        }
        console.log(this.arr_ForceBall);
        
    }

    /**激光数据初始化 */
    private laserInit(arr_Laser) : void
    {
       if(!arr_Laser[0]) return;
        if(this.arr_Laser ==undefined)
            this.arr_Laser = new Array<Laser>();
        for(let i=0;i<arr_Laser.length;i++)
        {
            if(this.arr_Laser[i])
            {
                this.arr_Laser[i].update({"laser_X":arr_Laser[i].laser_X,"laser_Y":arr_Laser[i].laser_Y,"rotation":arr_Laser[i].rotation,"isAdvanceLaser":arr_Laser[i].isAdvanceLaser,"time":arr_Laser[i].time,"move":arr_Laser[i].move});
            }
            else
            {
                this.arr_Laser[i] = new Laser(this.scene.panel_GameWorld);
                this.arr_Laser[i].init({"laser_X":arr_Laser[i].laser_X,"laser_Y":arr_Laser[i].laser_Y,"rotation":arr_Laser[i].rotation,"isAdvanceLaser":arr_Laser[i].isAdvanceLaser,"time":arr_Laser[i].time,"move":arr_Laser[i].move});
            }
        }
        console.log(this.arr_Laser);
        
    }

    /**帽子初始化 */
    private magicHatInit(arr_MagicHat) : void
    {
        if(!arr_MagicHat[0]) return;
        if(this.arr_MagicHat==undefined)
        {
            this.arr_MagicHat = new Array<MagicHat>();
        }
            
        for(let i=0; i<arr_MagicHat.length; i++)
        {   
            if(this.arr_MagicHat[i])
            {
                this.arr_MagicHat[i].update(
                    {"magicHat_X1":arr_MagicHat[i].magicHat_X1,"magicHat_Y1":arr_MagicHat[i].magicHat_Y1,"rotation1":arr_MagicHat[i].rotation1,"move1":arr_MagicHat[i].move1,"rotate1":arr_MagicHat[i].rotate1,"v1":arr_MagicHat[i].v1,
                     "magicHat_X2":arr_MagicHat[i].magicHat_X2,"magicHat_Y2":arr_MagicHat[i].magicHat_Y2,"rotation2":arr_MagicHat[i].rotation2,"move2":arr_MagicHat[i].move2,"rotate2":arr_MagicHat[i].rotate2,"v2":arr_MagicHat[i].v2,
                     "color":arr_MagicHat[i].color});
            }
            else
            { 
                this.arr_MagicHat[i] = new MagicHat(this.scene.panel_GameWorld);
                this.arr_MagicHat[i].init(
                    {"magicHat_X1":arr_MagicHat[i].magicHat_X1,"magicHat_Y1":arr_MagicHat[i].magicHat_Y1,"rotation1":arr_MagicHat[i].rotation1,"move1":arr_MagicHat[i].move1,"rotate1":arr_MagicHat[i].rotate1,"v1":arr_MagicHat[i].v1,
                     "magicHat_X2":arr_MagicHat[i].magicHat_X2,"magicHat_Y2":arr_MagicHat[i].magicHat_Y2,"rotation2":arr_MagicHat[i].rotation2,"move2":arr_MagicHat[i].move2,"rotate2":arr_MagicHat[i].rotate2,"v2":arr_MagicHat[i].v2,
                     "color":arr_MagicHat[i].color});
            }
        }
        console.log(this.arr_MagicHat);
    }
///////////////////////////////////////////////////////////////////////////////////////////////////游戏逻辑↓








    /***糖果检测*/
    private candyTest() : void
    {
        //x 
        let x = this.candy.arr_Sp[0].x;
        let y = this.candy.arr_Sp[0].y;
        // console.log(x + "," + y);
        //与怪物的距离检测 - 碎糖果已处理 没测试
        this.testMonster(x,y);
        //与边界的距离检测 - 碎糖果已处理 没测试
        this.testStage(x,y);
        //与星星的距离检测 - 碎糖果已处理 没测试
        this.testStars(x,y);
        //与泡泡的距离检测 - 碎糖果已处理 没测试
        this.testBalloon(x,y);
        //与帽子的距离检测 - 碎糖果已处理 没测试
        this.testHat(x,y);
        //与hook道具的检测 - 碎糖果已处理 没测试
        this.testHook(x,y);
        //与锥子的距离检测 - 碎糖果已处理 没测试 
        this.testKnife(x,y);
        //与推力球的距离检测 - 碎糖果已处理 没测试
        this.testForceBall(x,y);
        //与激光的距离检测  - 碎糖果已处理 没测试
        this.testLaser(x,y);
        //与鼠标的距离检测 - 超能力 - 碎糖果已处理
        this.testSuper(x,y);
        //碎糖果与碎糖果的距离检测 
        if(this.candy2) this.testCandyAndCandy(x,y);
        // console.log(this.candy.isExistBalloon);
    }

    /**碎糖果与碎糖果的距离检测 */
    private testCandyAndCandy(x,y) : void
    {
        let candyOneX = x + this.scene.panel_GameWorld.x;
        let candyOneY = y + this.scene.panel_GameWorld.y;
        let candyTwoX = this.candy2.arr_Sp[0].x + this.scene.panel_GameWorld.x;
        let candyTwoY = this.candy2.arr_Sp[0].y + this.scene.panel_GameWorld.y;
        let dic = this.countDic_Object({x:candyOneX,y:candyOneY},{x:candyTwoX,y:candyTwoY});
        if(dic < 25 && this.isToOne == false)
        {//合并
            this.candy2.CandytoOne(this.candy.arr_Sp[0]);
            this.isToOne = true;        
        }
    }

    /** 超能力 */
    private testSuper(x,y) : void
    {
        if(!this.isOpenSuper || !this.isMouseDown) return;
        //超能力
        let mX = Laya.stage.mouseX  - this.scene.panel_GameWorld.x;
        let mY = Laya.stage.mouseY  - this.scene.panel_GameWorld.y;
        let dic = this.countDic_Object({"x":x,"y":y},{"x":mX,'y':mY});
        if(dic < 100)
        {
            let vX = GameConfig.SUPER_V * this.rotationDeal(mX,mY,x,y,"cos");
            let vY = GameConfig.SUPER_V * this.rotationDeal(mX,mY,x,y,"sin");   
            this.candy.superSetV(vX,vY);
            if(this.candy2) 
            {
                vX = GameConfig.SUPER_V * this.rotationDeal(mX,mY,this.candy.arr_Sp[0].x,this.candy.arr_Sp[0].y,"cos");
                vY = GameConfig.SUPER_V * this.rotationDeal(mX,mY,this.candy.arr_Sp[0].x,this.candy.arr_Sp[0].y,"sin");
                this.candy2.superSetV(vX,vY);
            }
        }
    }

    /** 与hook道具的检测*/
    private testHook(x,y) : void//Hook2
    {
        this.testPublicHook(this.candy);
        if(this.candy2)this.testPublicHook(this.candy2);    
        // for(let i = 0; i< this.arr_Hook.length ; i++)
        // {
        //     if(this.arr_Hook[i].style=="hookslider"){
        //         this.arr_Rope[i].ropePointsArray[0].sp.pos(this.arr_Hook[i].sp.x,this.arr_Hook[i].sp.y);
        //     }
        // }
    }

    /** 与Hook的检测 */
    private testPublicHook(candy) : void
    {
        let dic;
        let rope : Rope;
        for(let i = 0; i< this.arr_Hook.length ; i++)
        {
            if(this.arr_Hook[i].style != "hook2") continue;
            if(this.arr_Hook[i].isCreate == true) continue;
            //hook逻辑
            dic = this.countDic_Object({"x":candy.arr_Sp[0].x,"y":candy.arr_Sp[0].y},{"x":this.arr_Hook[i].sp.x,'y':this.arr_Hook[i].sp.y});
            if(dic < this.arr_Hook[i].size)
            {//创建绳子
                rope = new Rope(this.scene.panel_GameWorld);
                rope.initRopeHook2(this.arr_Hook[i].sp.x,this.arr_Hook[i].sp.y,candy.arr_Sp[0].x,candy.arr_Sp[0].y);
                this.arr_Hook[i].isCreate = true;
                this.arr_Rope.push(rope);
                rope.connectCandy(candy,-1);
                if(this.arr_Spider)
                {
                    this.arr_Spider.forEach(spider =>{
                        if(spider.sp.x == this.arr_Hook[i].sp.x && spider.sp.y == this.arr_Hook[i].sp.y)
                        {
                            console.log("有怪物！！");
                            spider.foundCandy(rope,candy);
                        }
                    });
                }
                this.arr_Hook[i].spp.visible = false;
                this.arr_Hook[i].setRopePoint(rope.ropePointsArray[0]);
            }

        }
        
    }
    /** 与星星的距离检测*/
    private testStars(x,y) : void
    {
        this.candyTestStar(this.candy);
        if(this.candy2) this.candyTestStar(this.candy2);
    }

    /** 与星星的距离检测  已添加碎糖果*/    
    private candyTestStar(candy) : void
    {
        let dic;
        this.arr_Star.forEach(star => {
            if (!star.isDestroy) {
                dic = this.countDic_Object({ "x": candy.arr_Sp[0].x, "y": candy.arr_Sp[0].y }, { "x": star.sp.x, 'y': star.sp.y });
                if (dic < (star.sp.width)) {
                    star.starDestroy(star.style);
                    this.monster.monsterAction(GameConfig.ANI_MONSTER_HAPPYE, false);
                    this.score++;
                    this.showSocre();
                }
            }
        });
    }

    /**与怪物的距离检测 碎糖果已处理*/
    private testMonster(x,y) : void
    {
        if(!this.isToOne) return; //没有融合就不用检测
        if(this.isEated) return;
        let dic = this.countDic_Object({"x":this.candy.arr_Sp[0].x,"y":this.candy.arr_Sp[0].y},{"x":this.monster.x,'y':this.monster.y});
        if(dic<GameConfig.MONSTER_EAT_DIC)
        {
            // console.log("吃糖果");
            this.candyEated();
        }
        else if(dic<GameConfig.MONSTER_OPEN_MOUSE)
        {
            // console.log("张大嘴");
            this.monster.monsterAction(GameConfig.ANI_MONSTER_OPEN,false);
            // this.monster.wantEat();
        }
        else if(dic < GameConfig.MONSTER_OPEN_MOUSE + 20)
        {
            this.monster.monsterAction(GameConfig.ANI_MONSTER_STAND,true);
        }
    }

    /**糖果被吃 事件处理 */
    private candyEated() {
        Laya.timer.clear(this, this.candyTest);
        if (this.arr_Balloon) {
            for (let i = 0; i < this.arr_Balloon.length; i++) {
                if (this.candy.isExistBalloon) {
                    this.arr_Balloon[i].balloon_ClickBoom(this.candy);
                }
            }
        }
        this.isOpenSuper = false;
        this.monster.monsterAction(GameConfig.ANI_MONSTER_EAT, true);
        this.candy.candyDestroy(this.monster.sp.x, this.monster.sp.y);
        Laya.timer.once(1250, this, this.showMenu);
        this.showSocreMenu();
        //分数记录
        this.writeData(this.score);
    }

    /**与泡泡的距离检测 */
    private testBalloon(x,y):void{
        if(!this.arr_Balloon) return;
        //检测与糖果得距离，碰撞到则启动泡泡效果,在GamePage中开启此检测方法，obj1为糖果的sprite
        this.balloonPublicTest(this.candy);
        if(this.candy2) this.balloonPublicTest(this.candy2);
    }
    /**处理泡泡碰撞逻辑 - 通用*/
    private balloonPublicTest(candy) {
        let dic;
        this.arr_Balloon.forEach(balloon => {
            if (!balloon.isCollision) {
                dic = this.countDic_Object({ "x": candy.arr_Sp[0].x, "y": candy.arr_Sp[0].y }, { "x": balloon.sp.x, 'y': balloon.sp.y });
                if (dic < balloon.sp.width / 2 + 10) {
                    balloon.isCollision = true;
                    //检测是否有其他泡泡与糖果相撞
                    if (candy.isExistBalloon) {
                        balloon.balloon_Boom();
                    }
                    else {
                        candy.isExistBalloon = true;
                        balloon.sp.alpha = 0;
                        balloon.anim1.visible = true;
                        balloon.anim1.play(0, true);
                        Laya.timer.frameLoop(1, balloon, balloon.balloon_Float, [candy.arr_Sp[0], candy.arr_Body]);
                        balloon.sp.on(Laya.Event.MOUSE_DOWN, balloon, balloon.balloon_ClickBoom, [candy]);
                    }
                }
            }
        });
    }

    /**与魔法帽的检测 **/
    private testHat(x,y) : void
    {
        if(!this.arr_MagicHat) return;        
        
        this.testPublicTest(this.candy);
        if(this.candy2) this.testPublicTest(this.candy2);
        
    }
    /**魔法帽的检测  通用*/
    private testPublicTest(candy) {
        this.arr_MagicHat.forEach(magicHat => {
            let collide1 = magicHat.sp1.hitTestPoint(candy.arr_Sp[0].x + this.scene.panel_GameWorld.x, candy.arr_Sp[0].y + this.scene.panel_GameWorld.y);
            let collide2 = magicHat.sp2.hitTestPoint(candy.arr_Sp[0].x + this.scene.panel_GameWorld.x, candy.arr_Sp[0].y + this.scene.panel_GameWorld.y);
            //如果糖果未与这对帽子的任意一个碰撞
            if (!collide1 && !collide2) {
                magicHat.isCollision = false;
            }
            //检测是否与这对帽子的任意一个碰撞
            if (collide1) {
                //碰撞到了，但是检测时否还在另一个帽子的检测范围内
                if (!magicHat.isCollision) {
                    //检测帽子碰撞的方向，若与帽子口相反，则不进行糖果位移
                    if (((Math.cos(magicHat.sp1.rotation / 180 * Math.PI) >= 0 && candy.arr_Body[0].linearVelocity.y >= 0 && magicHat.rotate1 == 0) ||
                        (Math.cos(magicHat.sp1.rotation / 180 * Math.PI) <= 0 && candy.arr_Body[0].linearVelocity.y <= 0 && magicHat.rotate1 == 0))
                        || ((Math.cos(magicHat.sp1.rotation / 180 * Math.PI) >= 0 && candy.arr_Body[0].linearVelocity.y <= 0 && magicHat.rotate1 != 0) ||
                            (Math.cos(magicHat.sp1.rotation / 180 * Math.PI) <= 0 && candy.arr_Body[0].linearVelocity.y >= 0 && magicHat.rotate1 != 0))) {
                        //断开joint
                        candy.candyDestroyJoint();
                        this.arr_Rope.forEach(rope => {
                            if (!rope.isCuted) {
                                rope.ropeJointDestroy();
                            }
                        });
                        //设置速度 -----测试-----                  
                        let velocity = Math.sqrt(Math.pow(candy.arr_Body[0].linearVelocity.x, 2) + Math.pow(candy.arr_Body[0].linearVelocity.y, 2));
                        //使小球换位置出现的方法
                        for (let i = 0; i < candy.arr_Sp.length; i++) {
                            //根据帽子锚点位置调整距离
                            if (magicHat.rotate2 == 0) {
                                candy.arr_Sp[i].pos(magicHat.sp2.x, magicHat.sp2.y);
                            }
                            else {
                                candy.arr_Sp[i].pos(magicHat.sp2.x + Math.sin((magicHat.sp2.rotation + 180) / 180 * Math.PI) * (Math.abs(magicHat.rotate2) + magicHat.sp2.height / 2), magicHat.sp2.y - Math.cos((magicHat.sp2.rotation + 180) / 180 * Math.PI) * (Math.abs(magicHat.rotate2) + magicHat.sp2.height / 2));
                            }
                            candy.arr_Body[i].setVelocity({ x: 0, y: 0 });
                            candy.arr_Body[i].setVelocity({ x: Math.sin(magicHat.rotation2 / 180 * Math.PI) * velocity, y: -Math.cos(magicHat.rotation2 / 180 * Math.PI) * velocity });
                        }
                        magicHat.isCollision = true;
                    }
                }
                else {
                    magicHat.isCollision = true;
                }
            }
            if (collide2) {
                if (!magicHat.isCollision) {
                    if (((Math.cos(magicHat.sp2.rotation / 180 * Math.PI) >= 0 && candy.arr_Body[0].linearVelocity.y >= 0 && !magicHat.rotate2[0]) ||
                        (Math.cos(magicHat.sp2.rotation / 180 * Math.PI) <= 0 && candy.arr_Body[0].linearVelocity.y <= 0 && !magicHat.rotate2[0]))
                        || ((Math.cos(magicHat.sp2.rotation / 180 * Math.PI) >= 0 && candy.arr_Body[0].linearVelocity.y <= 0 && magicHat.rotate2[0]) ||
                            (Math.cos(magicHat.sp2.rotation / 180 * Math.PI) <= 0 && candy.arr_Body[0].linearVelocity.y >= 0 && magicHat.rotate2[0]))) {
                        //断裂joint
                        candy.candyDestroyJoint();
                        this.arr_Rope.forEach(rope => {
                            if (!rope.isCuted) {
                                rope.ropeJointDestroy();
                            }
                        });
                        let velocity = Math.sqrt(Math.pow(candy.arr_Body[0].linearVelocity.x, 2) + Math.pow(candy.arr_Body[0].linearVelocity.y, 2));
                        //使小球换位置出现的方法
                        for (let i = 0; i < candy.arr_Sp.length; i++) {
                            //根据帽子锚点位置调整距离
                            if (magicHat.rotate1 == 0) {
                                candy.arr_Sp[i].pos(magicHat.sp1.x, magicHat.sp1.y);
                                candy.arr_Body[i].setVelocity({ x: 0, y: 0 });
                                candy.arr_Body[i].setVelocity({ x: Math.sin(magicHat.rotation1 / 180 * Math.PI) * velocity, y: -Math.cos(magicHat.rotation1 / 180 * Math.PI) * velocity });
                            }
                            else {
                                candy.arr_Sp[i].pos(magicHat.sp1.x + Math.sin((magicHat.sp1.rotation + 180) / 180 * Math.PI) * (Math.abs(magicHat.rotate1) + magicHat.sp1.height / 2), magicHat.sp1.y - Math.cos((magicHat.sp1.rotation + 180) / 180 * Math.PI) * (Math.abs(magicHat.rotate1) + magicHat.sp1.height / 2));
                                candy.arr_Body[i].setVelocity({ x: 0, y: 0 });
                                candy.arr_Body[i].setVelocity({ x: Math.sin(magicHat.rotation1 / 180 * Math.PI) * velocity, y: -Math.cos(magicHat.rotation1 / 180 * Math.PI) * velocity });
                            }
                        }
                        magicHat.isCollision = true;
                    }
                    else {
                        magicHat.isCollision = true;
                    }
                }
            }
        });
    }

    /**与锥子的距离检测 */
    private testKnife(x,y){
        if(!this.arr_Knife) return;
        if(this.isOpenSuper) return;
        //检测与锥子得距离，碰撞到则播放哭泣动画结束游戏,在GamePage中开启此检测方法
        this.testPublicKnife(this.candy);
        if(this.candy2) this.testPublicKnife(this.candy2);

    }
    
    private testPublicKnife(candy) {
        let collide;
        this.arr_Knife.forEach(knife => {
            if (!knife.isCollision) {
                // collide=knife.sp.hitTestPoint(this.candy.arr_Sp[0].x - this.scene.panel_GameWorld.x,this.candy.arr_Sp[0].y - this.scene.panel_GameWorld.y);
                // 
                collide = knife.knife.hitTestPoint(candy.arr_Sp[0].x + this.scene.panel_GameWorld.x,candy.arr_Sp[0].y + this.scene.panel_GameWorld.y);
                if (collide) {
                    knife.isCollision = true;
                    //糖果破碎
                    candy.becomeApart(candy.arr_Sp[0].x, candy.arr_Sp[0].y);
                    this.failGame();
                }
            }
        });
    }

    private testForceBall(x,y){
        if(!this.arr_ForceBall) return;
        //检测糖果是否进入推力球检测区域，若在区域内点击推力球触发推力功能
        this.testPublicForceBall(this.candy);
        if(this.candy2) this.testPublicForceBall(this.candy2);
    }

    private testPublicForceBall(candy) {
        let collide;
        this.arr_ForceBall.forEach(forceball => {
            // console.log(this.candy.arr_Sp[0].x - this.scene.panel_GameWorld.x);
            collide = forceball.spRect.hitTestPoint(candy.arr_Sp[0].x + this.scene.panel_GameWorld.x, candy.arr_Sp[0].y + this.scene.panel_GameWorld.y);
            if (collide) {
                forceball.isApplyForce = true;
                // console.log(forceball.clickCount);
            }
            else {
                forceball.isApplyForce = false;
                forceball.clickCount = 0;
            }
        });
    }

    private testLaser(x,y){
        if(!this.arr_Laser) return;
        //检测糖果是否进入激光检测区域，若在区域内则糖果破裂
        this.testPublicLaser(this.candy);
        if(this.candy2) this.testPublicLaser(this.candy2);
    }

    private testPublicLaser(candy) {
        let collide;
        this.arr_Laser.forEach(laser => {
            if (!laser.isCollision) {
                collide = laser.spRect.hitTestPoint(candy.arr_Sp[0].x + this.scene.panel_GameWorld.x, candy.arr_Sp[0].y + this.scene.panel_GameWorld.y);
                if (!laser.isAdvanceLaser) {
                    if (collide) {
                        laser.isCollision = true;
                        //糖果破碎
                        candy.becomeApart(candy.arr_Sp[0].x, candy.arr_Sp[0].y);
                        this.monster.monsterAction(GameConfig.ANI_MONSTER_SAD, false);
                        Laya.timer.once(1250, this, this.onReGame);
                    }
                }
            }
        });
    }

    /**显示菜单 */
    private showMenu() : void
    {
        Laya.timer.clear(this,this.showMenu);
        this.doorOpen.visible = true;
        this.doorOpen.ani3.play(0,false);
        this.doorOpen.img_xiaodao.y = 800;
        Laya.MouseManager.enabled = false;                
        //比较之前在此关获得的星星，若比之前多则更新总分数
    }

     /**边界检测 */
    private testStage(x,y) : void
    {
        if(this.isOpenSuper)
        {
            let candy = this.candy.arr_Sp[0].getComponents(Laya.RigidBody)[0] as Laya.RigidBody;
            this.superPower(y, candy, x);
            let candy2 = this.candy2.arr_Sp[0];          
            this.superPower(candy2.y,candy2.getComponents(Laya.RigidBody)[0],candy2.x);
        }
        else if(y<-200||y>this.mapHight)
        {
            this.candyFall();
        }
        else if(this.candy2)
        {//碎糖果的边界检测
            if(this.candy2.arr_Sp[0].y<-200 || this.candy2.arr_Sp[0].y>this.mapHight)
            {
                this.candyFall();
            }
        }
    }
    
    /**超能力效果 */
    private superPower(y: any, candy: Laya.RigidBody, x: any) {
        if (y > this.mapHight) {
            candy.applyLinearImpulseToCenter({ x: 0, y: -4 });
        }
        if (y < 10) {
            candy.applyLinearImpulseToCenter({ x: 0, y: 4 });
        }
        if (x < 10) {
            candy.applyLinearImpulseToCenter({ x: 4, y: 0 });
        }
        if (x > this.mapWidth) {
            candy.applyLinearImpulseToCenter({ x: -4, y: 0 });
        }
    }

    /**糖果掉落出边界，游戏失败重开 */
    private candyFall() {
        console.log("游戏失败");
        this.monster.monsterAction(GameConfig.ANI_MONSTER_SAD, false);
        Laya.timer.clear(this, this.candyTest);
        this.onReGame();
    }

///////////////////////////////////////mouseCute
    private mouseCute() : void
    {
        //检测是否正按下鼠标移动钩子，若未按下则可开启割绳子检测
        let isDown = true;
        for(let i=0;i<this.arr_Hook.length;i++){
           if(this.arr_Hook[i].isDown)
            {
                isDown = false;
            }
        }
        if(this.isMouseDown && isDown) 
        {
            let mX = Laya.stage.mouseX - this.scene.panel_GameWorld.x;
            let mY = Laya.stage.mouseY - this.scene.panel_GameWorld.y;
            let cos = this.rotationDeal(this.lastMousePos.x,this.lastMousePos.y,mX,mY,"cos");
            let sin = this.rotationDeal(this.lastMousePos.x,this.lastMousePos.y,mX,mY,"sin");
            let dic : number;
            //hook切割点
            let hookHead;
            let candyEnd;
            if(this.lastMousePos.x !=null && this.lastMousePos.y != null)
            {
                dic = this.countDic_Object({x:this.lastMousePos.x,y:this.lastMousePos.y},{x:mX,y:mY});
                // console.log("dic::" + Math.floor(dic));
            }
            //普通绳子
            this.testMouseCandy(dic,mX,mY,cos,sin,hookHead,this.candyEated,this.arr_Rope);
            //破碎糖果的绳子
            if(this.candy2) this.testMouseCandy(dic,mX,mY,cos,sin,hookHead,this.candyEated,this.arr_Rope2);
            this.lastMousePos.x = mX;
            this.lastMousePos.y = mY;
            // console.log(this.lastMousePos.x + ","  + this.lastMousePos.y);
        }
    }


    /**鼠标绳子检测 */
    private testMouseCandy(dic,mX,mY,cos,sin,hookHead,candyEnd,ropeArray) : void
    {
        ropeArray.forEach(Rope => {
            if(!Rope.isCuted)
            {
                for(let i=0;i<Rope.ropePointsArray.length;i++)
                {
                    let ropePoint = Rope.ropePointsArray[i];
                    let f:any = {};
                    let s:any ={};
                    let count : number = 1;
                    f.x = ropePoint.sp.x;
                    f.y = ropePoint.sp.y;
                    if(dic)//计算需求数量
                    {
                        count = count + Math.floor(dic/25);
                        // console.log("pointCount::" + Math.floor(dic));
                    }
                    for(let z = 0; z<count ; z++)//循环检测
                    {
                        if(z == count - 1)//最后一个鼠标点
                        {
                            s.x = mX;
                            s.y = mY; 
                        }
                        else//其他点
                        {
                            s.x = this.lastMousePos.x + cos * z * 25;
                            s.y = this.lastMousePos.y + sin * z * 25;
                            // console.log("testPoint(" + s.x + "," + s.y + ")");
                        }                            
                        //切割优化
                        hookHead = 5;
                        candyEnd = Rope.ropePointsArray.length - 6;
                        if(Rope.ropePointsArray.length <20)
                        {
                            hookHead = 0;
                            candyEnd += 2;
                        }
                        //开始检测
                        if(this.countDic_Object(f,s) < 15 && hookHead < i && i < candyEnd)//优化绳子切割
                        {
                            // console.log(Rope.ropePointsArray.length + " :::::::::: index ::::::::: " + i);
                            //对蜘蛛进行操作
                            if(this.arr_Spider)
                            {
                                this.arr_Spider.forEach(Spider => {
                                    if(Spider.rope == Rope)
                                    {
                                        Spider.stopEatCandy();
                                    }
                                });
                            }
                            //断开连接
                            if(ropePoint.sp.getComponent(Laya.RevoluteJoint))
                            {
                                ropePoint.sp.getComponent(Laya.RevoluteJoint).destroy();
                                Rope.ropeCuted();
                                this.ropeJonitCute(Rope);
                                break;
                            }
                        }
                    }
                    if(Rope.isCuted) break;
                }

            }   
        });
    }



    private ropeJonitCute(Rope : Rope) {
        let ropeJoint = Rope.ropePointsArray[0].sp.getComponents(Laya.RopeJoint);
        if(ropeJoint)
        {
            ropeJoint[0].destroy();
        }
    }

    /**游戏失败，统一处理 */
    private failGame() : void
    {
        this.isEated = true;                 
        this.monster.monsterAction(GameConfig.ANI_MONSTER_SAD,false);
        Laya.timer.once(1500,this,this.onReGame);
    }

/////////////////////////////Tool
    /**
     * 距离计算
     * 2 对象
     * first
     * second
     */
    public countDic_Object(f:any,s:any) : number
    {
        return Math.sqrt(Math.pow(f.x - s.x,2) + Math.pow(f.y - s.y,2));
    }

    public rotationDeal(fx:number,fy:number,sx:number,sy:number,getString) : number
    {
        /**斜边 */
        let c : number = Math.sqrt(Math.pow(fx - sx,2) + Math.pow(fy - sy,2));
        /**临边 */
        let a : number = sx - fx;
        /**对边 */
        let b : number = sy - fy;
        
        if(getString == "sin")
        {
            //console.log("#sin ==" + (b/c));
            return (b/c);
        }
        else if(getString == "cos")
        {
            //console.log("#cos ==" + (a/c));
            return (a/c);
        }
        else
        {
            //console.log("#tan ==" + (b/a));//对边 比 临边 
            return (b/a);
        }
    }
    /**数据写入 星星数量*/
    private writeData(stars:number) : void
    {
        let playerData :PlayerData = PlayerData.ins;
        //[0,1,2,3,3,1,-1]
        let boxData = Laya.WeakObject.I.get(this.quarterIndex + "-" + this.boxIndex);
        //加总星星数量
        if(boxData[this,this.cardIndex] != undefined)
        {
            playerData.starNum += stars - boxData[this.cardIndex];
        }
        else
        {
            playerData.starNum +=stars;
        }
        //关卡推移
        if(boxData[this.cardIndex] == -1 && this.cardIndex != 24)
        {
            boxData[this.cardIndex + 1] = -1; 
        }
        if(boxData[this.cardIndex] == 24)
        {
            let boxDataNext = Laya.WeakObject.I.get(this.quarterIndex + "-" + (++this.boxIndex));
            if(boxDataNext)
                boxDataNext[0] = -1;
        }
        boxData[this.cardIndex] = stars;
        this.score = 0;
    }

    /**同移动运行方法 */
    private moveTogether() : void
    {
        GameConfig.CaX =this.scene.panel_GameWorld.x;
        GameConfig.CaY =this.scene.panel_GameWorld.y;
        //气泡移动同步
        if(this.arr_Balloon)
        {
            this.arr_Balloon.forEach(ball =>{
                ball.moveTogether();
            });
        }
        //糖果移动同步
        this.candy.moveTogether();
        if(this.candy2) this.candy2.moveTogether();
        //绳子移动同步
        if(this.arr_Rope)
        {   
            this.arr_Rope.forEach(rope =>{
                rope.moveTogether();
            });
        }
        //锥子移动同步
        if(this.arr_Knife)
        {
            this.arr_Knife.forEach(knife =>{
                knife.moveTogether();
            });
        }
    }

    //星星来回移动
    private star_MoveBySelf(moveArray:Array<Star>,configArray:Array<any>):void{      
        for(let i=0;i<moveArray.length;i++){
            let x_Add=this.rotationDeal(configArray[i].star_X,configArray[i].star_Y,configArray[i].move[0],configArray[i].move[1],"cos");
            let y_Add=this.rotationDeal(configArray[i].star_X,configArray[i].star_Y,configArray[i].move[0],configArray[i].move[1],"sin");
            if(moveArray[i].isGoing){
                moveArray[i].sp.x+=x_Add;
                moveArray[i].sp.y+=y_Add;
                if(x_Add==0){
                    if(moveArray[i].sp.y==configArray[i].move[1]){
                        moveArray[i].isGoing=false;
                    }
                }
                else if(y_Add==0){
                    if(moveArray[i].sp.x==configArray[i].move[0]){
                        moveArray[i].isGoing=false;
                    }
                }
                else
                {
                    if(Math.abs(moveArray[i].sp.x-configArray[i].move[0])<0.3){
                        moveArray[i].sp.x=configArray[i].move[0];
                        moveArray[i].sp.y=configArray[i].move[1];
                        moveArray[i].isGoing=false;
                        
                    }
                }
            }else{
                moveArray[i].sp.x-=x_Add;
                moveArray[i].sp.y-=y_Add;
                if(x_Add==0){
                    if(moveArray[i].sp.y==configArray[i].star_Y){
                        moveArray[i].isGoing=true;
                    }
                }
                else if(y_Add==0){
                    if(moveArray[i].sp.x==configArray[i].star_X){
                        moveArray[i].isGoing=true;
                    }
                }else {
                    if(Math.abs(moveArray[i].sp.x-configArray[i].star_X)<0.3){
                        moveArray[i].sp.x=configArray[i].star_X;
                        moveArray[i].sp.y=configArray[i].star_Y;
                        moveArray[i].isGoing=true;
                    }
                }
            }
            } 
        
    }
}

