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
    //----------------------------------------------
    /**地图配置 */
    private mapConfig : Config.MapConfig;
    //hook 需要重置
    public arr_Hook:Array<Hook>=new Array<Hook>();
    //绳子  需要重置
    public arr_Rope : Array<Rope>;
    //糖果  不需要重置
    public candy : Candy;
    //*怪物 */
    public monster : Monster;
    /**星星 */
    private arr_star : Array<Star>;
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
    /**得分记录 */
    private score : number;
    /**屏幕高度 */
    private screenHeight : number;
    
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
        //鼠标拖尾初始化
        this.initMouseTail();

        //界面数据 数值初始化
        this.scene.img_replay.alpha = 0;
        this.alphaZ = 1;
        this.score = 0;
        this.lastMousePos = {};
        this.isOpenSuper = false;
        this.isReplay = false;
        this.isEated = false;
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
        this.scene.img_gameBg.height =this.screenHeight
        this.scene.panel_GameWorld.height = this.screenHeight;
        this.scene.starAni.y = this.screenHeight - this.scene.starAni.height;      
    }

    private initBgSkin() : void
    {
        this.scene.img_gameBg.skin = "GameView/gameBg/boxBg_"+(this.boxIndex+1)+".jpg";
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
        this.arr_Rope.forEach(rope => {//取消绳子中的定时器
            rope.clearTimer();
        });
        this.candy.clearTimer();//取消糖果中的定时器
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
        this.arr_RemRope = undefined;
        this.isReplay = false;
        Laya.MouseManager.enabled = false; 
        this.isEated = false;    
        this.doorOpen.visible = true;   
        this.doorOpen.img_xiaodao.visible = true;        
        this.UpdateData(this.quarterIndex + "-" + this.boxIndex,++this.cardIndex,false);
        this.doorOpen.ani1.gotoAndStop(0);
        // this.doorOpen.img_xiaodao.y = 850;
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
        this.setBackground(this.mapConfig.arr_MapSkin);
        //怪物初始化
        this.monsterInit(this.mapConfig.monster);
        //钩子
        this.hookInit(this.mapConfig.arr_Hook);
        //绳子数据初始化
        this.ropeInit(this.mapConfig.arr_Rope,this.arr_Hook);
        //星星数据初始化
        this.starInit(this.mapConfig.arr_Star);
        //糖果数据初始化
        this.candyInit(this.mapConfig.candyConfig,this.mapConfig.arr_Rope.length,this.mapConfig.arr_Knife,this.mapConfig.arr_Laser);
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
        this.openDoorInit(this.mapConfig.arr_Rope);
        //激光数据初始化
        this.laserInit(this.mapConfig.arr_Laser);
        //绳子寻找糖果
        Laya.timer.loop(1,this,this.ropeToCandy);
        //割绳检测
        Laya.timer.loop(16,this,this.mouseCute);
        //糖果检测 
        Laya.timer.loop(1,this,this.candyTest);
        
    }
    /*** */
    private setBackground(arr_MapSkin) : void
    {
        if(arr_MapSkin.length == 1)
        {
            this.scene.img_gameBg.skin = arr_MapSkin[0];
        }
        this.newDoorUi();
        
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
              
       if(add == this.arr_Rope.length)
       {
           Laya.timer.clear(this,this.ropeToCandy);
           this.candy.set("useg");
           //连接糖果
           for(let i=0;i<this.arr_Rope.length;i++)
           {
   
               this.arr_Rope[i].connectCandy(this.candy,i);
               this.arr_Rope[i].ropePointsArray[this.arr_Rope.length - 1].sp.getComponents(Laya.RigidBody)[0].setVelocity({x:0,y:0});
           }
           //获取位置信息
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
        Laya.MouseManager.enabled = true;

    }

    /**开门动画初始化 */
    private openDoorInit(arr_Rope) : void
    {
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
        let star : Star;
        if(!this.arr_star)
        {
            this.arr_star = new Array<Star>();
            for(let i =0; i<3;i++)
            {
                star = new Star(starConfig[i],this.scene.panel_GameWorld);
                this.arr_star.push(star);
            }
        }
        else
        {
            for(let i=0 ; i<3;i++)
            {
                star = this.arr_star[i];
                star.update(starConfig[i]);
            }
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
    private candyInit(candyConfig,num,arr_Knife,arr_Laser) : void
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
    private ropeInit(arr_Rope,arr_Hook) : void
    {
        let rope : Rope;
        this.arr_Rope = new Array<Rope>();
        for(let i=0; i<arr_Rope.length; i++)
        {
            rope = new Rope(this.scene.panel_GameWorld);
            if(this.arr_RemRope === undefined)
            {
                rope.init(arr_Hook[i].hook_X,arr_Hook[i].hook_Y,arr_Rope[i].num,arr_Hook[i].style);
            }
            else
            {
                rope.rePlay(this.arr_RemRope[i],arr_Hook[i].style);
            }
            this.arr_Rope.push(rope);
        }
        for(let i = 0; i< arr_Rope.length;i++)
        {
            if(this.arr_Hook[i].length)
            {
                this.arr_Hook[i].setRopePoint(this.arr_Rope[i].ropePointsArray[0]);
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
                 this.arr_Knife[i].update({"knife_X":arr_Knife[i].knife_X,"knife_Y":arr_Knife[i].knife_Y,"style":arr_Knife[i].style,"rotation":arr_Knife[i].rotation,"isAlwaysRotate":arr_Knife[i].isAlwaysRotate,"move":arr_Knife[i].move});
             }
             else
             {
                 this.arr_Knife[i] = new Knife(this.scene.panel_GameWorld);
                 this.arr_Knife[i].init({"knife_X":arr_Knife[i].knife_X,"knife_Y":arr_Knife[i].knife_Y,"style":arr_Knife[i].style,"rotation":arr_Knife[i].rotation,"isAlwaysRotate":arr_Knife[i].isAlwaysRotate,"move":arr_Knife[i].move});
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
                this.arr_ForceBall[i].sp.on(Laya.Event.MOUSE_DOWN,this.arr_ForceBall[i],this.arr_ForceBall[i].forceball_applyForce,[this.candy]);
            }
            else
            {
                this.arr_ForceBall[i] = new ForceBall(this.scene.panel_GameWorld);
                this.arr_ForceBall[i].init({"forceball_X":arr_ForceBall[i].forceball_X,"forceball_Y":arr_ForceBall[i].forceball_Y,"rotation":arr_ForceBall[i].rotation});
                this.arr_ForceBall[i].sp.on(Laya.Event.MOUSE_DOWN,this.arr_ForceBall[i],this.arr_ForceBall[i].forceball_applyForce,[this.candy]);
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
        let x = this.candy.arr_Sp[0].x;
        let y = this.candy.arr_Sp[0].y;
        // console.log(x + "," + y);
        //与怪物的距离检测
        this.testMonster(x,y);
        //与边界的距离检测
        this.testStage(x,y);
        //与星星的距离检测
        this.testStars(x,y);
        //与泡泡的距离检测
        this.testBalloon(x,y);
        //与帽子的距离检测
        this.testHat(x,y);
        //与hook道具的检测
        this.testHook(x,y);
        //与锥子的距离检测
        this.testKnife(x,y);
        //与推力球的距离检测
        this.testForceBall(x,y);
        //与激光的距离检测
        this.testLaser(x,y);
        //与鼠标的距离检测 - 超能力
        this.testSuper(x,y);
        // console.log(this.candy.isExistBalloon);
    }

    /** 超能力 */
    private testSuper(x,y) : void
    {
        if(!this.isOpenSuper || !this.isMouseDown) return;
        //超能力
        let mX = Laya.stage.mouseX;
        let mY = Laya.stage.mouseY;
        let dic = this.countDic_Object({"x":x,"y":y},{"x":mX,'y':mY});
        if(dic < 100)
        {
            let vX = GameConfig.SUPER_V * this.rotationDeal(mX,mY,x,y,"cos");
            let vY = GameConfig.SUPER_V * this.rotationDeal(mX,mY,x,y,"sin");   
            this.candy.superSetV(vX,vY);
        }
    }

    /** 与hook道具的检测*/
    private testHook(x,y) : void//Hook2
    {
        let dic;
        let rope : Rope;
        for(let i = 0; i< this.arr_Hook.length ; i++)
        {
            if(this.arr_Hook[i].style != "hook2") continue;
            if(this.arr_Hook[i].isCreate == true) continue;
            //hook逻辑
            dic = this.countDic_Object({"x":x,"y":y},{"x":this.arr_Hook[i].sp.x,'y':this.arr_Hook[i].sp.y});
            if(dic < this.arr_Hook[i].size)
            {//创建绳子
                rope = new Rope(this.scene.panel_GameWorld);
                rope.initRopeHook2(this.arr_Hook[i].sp.x,this.arr_Hook[i].sp.y,x,y);
                this.arr_Hook[i].isCreate = true;
                this.arr_Rope.push(rope);
                rope.connectCandy(this.candy,-1);
                if(this.arr_Spider)
                {
                    this.arr_Spider.forEach(spider =>{
                        if(spider.sp.x == this.arr_Hook[i].sp.x && spider.sp.y == this.arr_Hook[i].sp.y)
                        {
                            console.log("有怪物！！");
                            spider.foundCandy(rope,this.candy);
                        }
                    });
                }
                this.arr_Hook[i].spp.visible = false;
                this.arr_Hook[i].setRopePoint(rope.ropePointsArray[0]);
            }

        }
        
        // for(let i = 0; i< this.arr_Hook.length ; i++)
        // {
        //     if(this.arr_Hook[i].style=="hookslider"){
        //         this.arr_Rope[i].ropePointsArray[0].sp.pos(this.arr_Hook[i].sp.x,this.arr_Hook[i].sp.y);
        //     }
        // }
    }

    /** 与星星的距离检测*/
    private testStars(x,y) : void
    {
        let dic;
        // console.log(this.arr_star);
        this.arr_star.forEach(star => {
            // console.log(star);
            if(!star.isDestroy)
            {
                dic = this.countDic_Object({"x":this.candy.arr_Sp[0].x,"y":this.candy.arr_Sp[0].y},{"x":star.sp.x,'y':star.sp.y});
                // console.log(dic);
                if(dic < 80)
                {
                    star.starDestroy(star.style);
                    this.monster.monsterAction(GameConfig.ANI_MONSTER_HAPPYE,false);
                    this.score++;
                    this.showSocre();
                }
            }
        });
    }
    
    /**与怪物的距离检测 */
    private testMonster(x,y) : void
    {
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
        if (this.arr_Balloon) {
            for (let i = 0; i < this.arr_Balloon.length; i++) {
                if (this.candy.isExistBalloon) {
                    this.arr_Balloon[i].balloon_ClickBoom(this.candy);
                }
            }
        }
        Laya.timer.clear(this, this.candyTest);
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
        let dic;
        this.arr_Balloon.forEach(balloon => {
            if(!balloon.isCollision)
            {
                dic = this.countDic_Object({"x":this.candy.arr_Sp[0].x,"y":this.candy.arr_Sp[0].y},{"x":balloon.sp.x,'y':balloon.sp.y});
                if(dic < 80)
                {
                    balloon.isCollision=true;
                    //检测是否有其他泡泡与糖果相撞
                    if(this.candy.isExistBalloon){
                        balloon.balloon_Boom();
                    }else{
                        this.candy.isExistBalloon=true;
                        balloon.sp.alpha=0;
                        balloon.anim1.visible=true;
                        balloon.anim1.play(0,true);                  
                        Laya.timer.frameLoop(1,balloon,balloon.balloon_Float,[this.candy.arr_Sp[0],this.candy.arr_Body]);                   
                        balloon.sp.on(Laya.Event.MOUSE_DOWN,balloon,balloon.balloon_ClickBoom,[this.candy]);                    
                    }        
                    
                    
                    
                }
            }
        });
        
    }
    /**与魔法帽的检测 **/
    private testHat(x,y) : void
    {
        if(!this.arr_MagicHat) return;        
        let dic1,dic2;
        this.arr_MagicHat.forEach(magicHat => {
                dic1 = this.countDic_Object({"x":this.candy.arr_Sp[0].x,"y":this.candy.arr_Sp[0].y},{"x":magicHat.sp1.x,'y':magicHat.sp1.y});
                dic2 = this.countDic_Object({"x":this.candy.arr_Sp[0].x,"y":this.candy.arr_Sp[0].y},{"x":magicHat.sp2.x,'y':magicHat.sp2.y});
                if(dic1>=50&&dic2>=50){
                    magicHat.isCollision=false;
                }
                if(dic1 < 50){
                    if(!magicHat.isCollision){
                        //使小球换位置出现的方法
                        this.candy.arr_Sp[0].pos(magicHat.sp2.x,magicHat.sp2.y);                        
                        let velocity=Math.sqrt(Math.pow(this.candy.arr_Body[0].linearVelocity.x,2)+Math.pow(this.candy.arr_Body[0].linearVelocity.y,2));
                        for(let i=0;i<this.candy.arr_Body.length;i++){
                            this.candy.arr_Body[0].setVelocity({x:0,y:0});
                        }
                        for(let i=0;i<this.candy.arr_Body.length;i++){
                            this.candy.arr_Body[0].setVelocity({x:Math.sin(magicHat.rotation2)*velocity,y:-Math.cos(magicHat.rotation2)*velocity});
                        }
                        magicHat.isCollision=true;
                        console.log(this.candy.arr_Body[0].linearVelocity);
                    }else{
                        magicHat.isCollision=true;
                    }                                       
                }
        
                if(dic2 < 50){
                    if(!magicHat.isCollision){
                        //使小球换位置出现的方法
                        this.candy.arr_Sp[0].pos(magicHat.sp1.x,magicHat.sp1.y);
                        
                        let velocity=Math.sqrt(Math.pow(this.candy.arr_Body[0].linearVelocity.x,2)+Math.pow(this.candy.arr_Body[0].linearVelocity.y,2));
                        for(let i=0;i<this.candy.arr_Body.length;i++){
                            this.candy.arr_Body[0].setVelocity({x:0,y:0});
                        }
                        for(let i=0;i<this.candy.arr_Body.length;i++){
                        this.candy.arr_Body[0].setVelocity({x:Math.sin(magicHat.rotation1)*velocity,y:-Math.cos(magicHat.rotation1)*velocity});
                        }
                        magicHat.isCollision=true;
                    }else{
                        magicHat.isCollision=true;
                    }
                }
                
                
            });
        
    }

    /**与锥子的距离检测 */
    private testKnife(x,y){
        if(!this.arr_Knife) return;
        //检测与锥子得距离，碰撞到则播放哭泣动画结束游戏,在GamePage中开启此检测方法
        let collide;
        this.arr_Knife.forEach(knife => {
            if(!knife.isCollision)
            {
                
                collide=knife.sp.hitTestPoint(this.candy.arr_Sp[0].x,this.candy.arr_Sp[0].y);
                if(collide)
                {
                    knife.isCollision=true;
                    //糖果破碎
                    this.candy.becomeApart(this.candy.arr_Sp[0].x,this.candy.arr_Sp[0].y);
                    this.failGame();
            }
        }
        });
    }
    
    private testForceBall(x,y){
        if(!this.arr_ForceBall) return;
        //检测糖果是否进入推力球检测区域，若在区域内点击推力球触发推力功能
        let collide;
        this.arr_ForceBall.forEach(forceball=>{
            collide=forceball.spRect.hitTestPoint(this.candy.arr_Sp[0].x,this.candy.arr_Sp[0].y);
            if(collide){
                forceball.isApplyForce=true;
                
            }else{
                forceball.isApplyForce=false;
            }
        })
    }

    private testLaser(x,y){
        if(!this.arr_Laser) return;
        //检测糖果是否进入激光检测区域，若在区域内则糖果破裂
        let collide;
        this.arr_Laser.forEach(laser=>{
            if(!laser.isCollision){
                collide=laser.spRect.hitTestPoint(this.candy.arr_Sp[0].x,this.candy.arr_Sp[0].y);
                if(!laser.isAdvanceLaser){
                    if(collide){
                        laser.isCollision=true;
                        //糖果破碎
                        this.candy.becomeApart(this.candy.arr_Sp[0].x,this.candy.arr_Sp[0].y);
                        this.monster.monsterAction(GameConfig.ANI_MONSTER_SAD,false);
                        Laya.timer.once(1250,this,this.onReGame);
                    }
                }
            
            }
            
        })
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
            if(y>this.screenHeight)
            {
                candy.applyLinearImpulseToCenter({x:0,y:-4});
            }
            if(y<10)
            {
                candy.applyLinearImpulseToCenter({x:0,y:4});
            }
            if(x<10)
            {
                candy.applyLinearImpulseToCenter({x:4,y:0});
            }
            if(x>470)
            {
                candy.applyLinearImpulseToCenter({x:-4,y:0}); 
            }
        }
        else if(y<0||y>this.screenHeight)
        {
            console.log("游戏失败");
            this.monster.monsterAction(GameConfig.ANI_MONSTER_SAD,false);
            // Laya.timer.onc;
            Laya.timer.clear(this,this.candyTest);
            this.onReGame();
        }
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
            let mX = Laya.stage.mouseX;
            let mY = Laya.stage.mouseY;
            let cos = this.rotationDeal(this.lastMousePos.x,this.lastMousePos.y,mX,mY,"cos");
            let sin = this.rotationDeal(this.lastMousePos.x,this.lastMousePos.y,mX,mY,"sin");
            let dic : number;
            if(this.lastMousePos.x !=null && this.lastMousePos.y != null)
            {
                dic = this.countDic_Object({x:this.lastMousePos.x,y:this.lastMousePos.y},{x:mX,y:mY});
                // console.log("dic::" + Math.floor(dic));
            }
            this.arr_Rope.forEach(Rope => {
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
                            //开始检测
                            if(this.countDic_Object(f,s) < 20 && 5 < i && i < Rope.ropePointsArray.length - 3)//优化绳子切割
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
                                if(ropePoint.sp.getComponent(Laya.RevoluteJoint))
                                {
                                    ropePoint.sp.getComponent(Laya.RevoluteJoint).destroy();
                                    Rope.ropeCuted();
                                    this.ropeJonitCute(Rope);
                                    break;
                                }
                            }
                        }
                    }

                }   
            });
            //
            this.lastMousePos.x = mX;
            this.lastMousePos.y = mY;
            // console.log(this.lastMousePos.x + ","  + this.lastMousePos.y);
        }
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
}

