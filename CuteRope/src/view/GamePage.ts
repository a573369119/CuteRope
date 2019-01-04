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
    /**得分记录 */
    private score : number;
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
//-------------------------------------------
    /**透明度转折变量 */
    private alphaZ : number = 0;


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
        //鼠标拖尾初始化
        let arr = [
            {url:"res/atlas/gameView/mouseTail.atlas"}
        ];
        Laya.loader.load(arr,Laya.Handler.create(this,this.initMouseTail));
        // ui初始化
        this.doorOpen = new ui.GameView.GameViewDoorUI();
        this.menuUI = new ui.GameView.GameMenuUI();
        this.shopDoor = new ui.topLeftUI();
        this.shopDialog = Laya.WeakObject.I.get("dialog");
        this.scene.addChild(this.shopDoor);
        this.shopDoor.x = 0 ;
        this.shopDoor.y = 0;
        this.scene.addChild(this.menuUI);
        this.scene.addChild(this.doorOpen);
        
        this.scene.img_replay.alpha = 0;
        this.alphaZ = 1;
        this.score = 0;

        Laya.MouseManager.enabled = false;
        this.doorOpen.ani1.play(0,false);
        this.menuUI.visible = false;
        //添加事件
        this.addEvents();
        //第一次更新游戏
        this.UpdateData(this.quarterIndex+ "-" + this.boxIndex,this.cardIndex,true);
        
        Laya.PhysicsDebugDraw.enable();
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
       
       this.addAnimationOver();
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
            });
        }
        if(this.arr_MagicHat)//取消帽子定时球
        {
            this.arr_MagicHat.forEach(hat => {
                hat.destroy();
            })
        }
        if(this.arr_Hook)//hook销毁
        {
            this.arr_Hook.forEach(hook => {
                hook.hookDestroy();
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
    }

   private onTeach() :void
   {
        this.shopDialog.set(1,true);
   }

   private onSuper() :void
   {
        this.shopDialog.set(2,true);
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
        Laya.MouseManager.enabled = true;
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
                this.showSocreMenu();
                this.scene.ani3.visible = false; 
                // this.doorOpen.visible = false;//关闭动画层                  
                break;
            case 4:
                this.scene.ani4.visible = false; 
                this.doorOpen.visible = false;//关闭动画层                  
                // this.doorOpen.visible = false;//关闭动画层
                break;
            //重新开始 或者 下一关。关闭计分板 打开箱子操作
            case 5:
                this.scene.ani5.visible = false; 
                // this.doorOpen.visible = false;//关闭动画层
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
        this.showSocre();
        this.UpdateData(this.quarterIndex + "-" + this.boxIndex,this.cardIndex,false);
        
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
        this.UpdateData("0-0",++this.cardIndex,false);
        Laya.MouseManager.enabled = false;        
        this.doorOpen.ani4.play(0,false);
     }

    /**事件 吃到糖果->重玩  效果开门重开 */
    private onReplay() : void
    {
        console.log("重玩  效果开门重开");
        this.removeEvents();
        this.score = 0;
        this.showSocre();
        Laya.MouseManager.enabled = false;              
        this.doorOpen.ani4.play(0,false);
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
        Laya.MouseManager.enabled = false;        
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
        Laya.MouseManager.enabled = false;
            
        // GameManager.ins_.getMediator(GameData.START_GAME_MEDIATOR).runRound();        
    }

    /**事件 超能力获取 */
    private onShopSuper() : void
    {
        console.log("获得超能力");
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
    }

    /**吃到糖果显示计分面板 */
    private showSocreMenu() : void
    {

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
        this.candyInit(this.mapConfig.candyConfig,this.mapConfig.arr_Rope.length,this.mapConfig.arr_Knife);
        //泡泡数据初始化
        this.balloonInit(this.mapConfig.arr_Balloon);
        //帽子数据初始化
        this.hatInit(this.mapConfig.arr_magicHat); 
        //锥子数据初始化
        this.knifeInit(this.mapConfig.arr_Knife);
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
    }
    /**ropeToCandy */
    private ropeToCandy() : void
    {
        let obj : any = {};
        let rope : Rope;
        let add = 0;
        for(let i=0;i<this.arr_Rope.length;i++)
        {
            rope = this.arr_Rope[i];
            obj.x = GameConfig.ROPE_TO_CANDY_SPEED * this.rotationDeal(rope.ropePointsArray[rope.ropePointsArray.length-1].sp.x,rope.ropePointsArray[rope.ropePointsArray.length-1].sp.y,this.candy.getCandySprite(0).x,this.candy.getCandySprite(0).y,"cos");
            obj.y = GameConfig.ROPE_TO_CANDY_SPEED * this.rotationDeal(rope.ropePointsArray[rope.ropePointsArray.length-1].sp.x,rope.ropePointsArray[rope.ropePointsArray.length-1].sp.y,this.candy.getCandySprite(0).x,this.candy.getCandySprite(0).y,"sin");
            rope.ropePointsArray[rope.ropePointsArray.length-1].body.setVelocity(obj);
            if(Math.sqrt(Math.pow(this.arr_Rope[i].ropePointsArray[this.arr_Rope[i].ropePointsArray.length-1].sp.x - this.candy.getCandySprite(0).x,2) + Math.pow(this.arr_Rope[i].ropePointsArray[this.arr_Rope[i].ropePointsArray.length-1].sp.y - this.candy.getCandySprite(0).y,2)) < 5) add++;
        }

        if(add == this.arr_Rope.length)
        {
			Laya.timer.clear(this,this.ropeToCandy);
            this.candy.set("useg");
            //连接糖果
            for(let i=0;i<this.arr_Rope.length;i++)
            {
                this.arr_Rope[i].connectCandy(this.candy,i);
            }
        }
    }

    /**帽子初始化 */
    private hatInit(hatConfig) : void
    {
        let hat : MagicHat;
        let color = "";
        if(!hatConfig[0]) return;
        if(!this.arr_MagicHat) this.arr_MagicHat = new Array<MagicHat>();
        for(let i=0; i<hatConfig.length; i++)
        {   
            if(i<2)
                color = "red";
            else
                color = "green";

            if(!this.arr_MagicHat[i])
            {
                hat = new MagicHat(hatConfig[i].x,hatConfig[i].y,hatConfig[i].rotation,this.scene.panel_GameWorld,color);
                this.arr_MagicHat.push(hat);
            }
            else
            {
                this.arr_MagicHat[i].update(hatConfig[i].x,hatConfig[i].y,hatConfig[i].rotation);
            }
        }
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
    }
    
    /**糖果数据初始化 */
    private candyInit(candyConfig,num,arr_Knife) : void
    {
        if(!this.candy) 
        {
            this.candy = new Candy(this.scene.panel_GameWorld);
            this.candy.init({"x":candyConfig.candy_X,"y":candyConfig.candy_Y,"style":candyConfig.style},num);
            /**-------是否初始化糖果碎片----- */
            if(arr_Knife[0]){
                this.candy.createCandyApart();
            }
        }
        else
        {
            this.candy.update({"x":candyConfig.candy_X,"y":candyConfig.candy_Y,"style":candyConfig.style},num);
            /**-------是否初始化糖果碎片----- */
            if(arr_Knife[0]){
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
                this.arr_Hook[i].update({"hook_X":arr_Hook[i].hook_X,"hook_Y":arr_Hook[i].hook_Y,"style":arr_Hook[i].style});
            }
            else
            {
                this.arr_Hook[i] = new Hook(this.scene.panel_GameWorld);
                this.arr_Hook[i].init({"hook_X":arr_Hook[i].hook_X,"hook_Y":arr_Hook[i].hook_Y,"style":arr_Hook[i].style});
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
            rope.init(arr_Hook[i].hook_X,arr_Hook[i].hook_Y,arr_Rope[i].num);
            this.arr_Rope.push(rope);
        }
        
    }

    /**泡泡数据初始化 */
    private balloonInit(arr_Balloon) : void
    {
        if(!arr_Balloon[0]) return;
        if(this.arr_Balloon  === undefined)
        
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
         
         if(this.arr_Knife ==undefined)
             this.arr_Knife = new Array<Knife>();
         for(let i=0;i<arr_Knife.length;i++)
         {
             if(this.arr_Knife[i])
             {
                 this.arr_Knife[i].update({"knife_X":arr_Knife[i].knife_X,"knife_Y":arr_Knife[i].knife_Y,"style":arr_Knife[i].style,"rotation":arr_Knife[i].rotation,"isAlwaysRotate":arr_Knife[i].isAlwaysRotate});
             }
             else
             {
                 this.arr_Knife[i] = new Knife(this.scene.panel_GameWorld);
                 this.arr_Knife[i].init({"knife_X":arr_Knife[i].knife_X,"knife_Y":arr_Knife[i].knife_Y,"style":arr_Knife[i].style,"rotation":arr_Knife[i].rotation,"isAlwaysRotate":arr_Knife[i].isAlwaysRotate});
             }
         }
         console.log(this.arr_Knife);
         
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
        console.log(this.candy.isExistBalloon);
    }

    /** 与hook道具的检测*/
    private testHook(x,y) : void//Hook2
    {
        let dic;
        let rope : Rope;
        for(let i = 0; i< this.arr_Hook.length ; i++)
        {
            if(this.arr_Hook[i].style == "hook1") continue;
            if(this.arr_Hook[i].isCreate == true) continue;
            //hook逻辑
            dic = this.countDic_Object({"x":x,"y":y},{"x":this.arr_Hook[i].sp.x,'y':this.arr_Hook[i].sp.y});
            if(dic < 150)
            {//创建绳子
                rope = new Rope(this.scene.panel_GameWorld);
                rope.initRopeHook2(this.arr_Hook[i].sp.x,this.arr_Hook[i].sp.y,x,y);
                this.arr_Hook[i].isCreate = true;
                this.arr_Rope.push(rope);
                rope.connectCandy(this.candy,i);
            }
        }
        
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
                    star.starDestroy();
                    this.score++;
                    this.showSocre();
                }
            }
        });
    }
    
    /**与怪物的距离检测 */
    private testMonster(x,y) : void
    {
        let dic = this.countDic_Object({"x":this.candy.arr_Sp[0].x,"y":this.candy.arr_Sp[0].y},{"x":this.monster.x,'y':this.monster.y});
        if(dic<GameConfig.MONSTER_EAT_DIC)
        {
            // console.log("吃糖果");
            if(this.arr_Balloon){
                for(let i=0;i<this.arr_Balloon.length;i++){
                    if(this.candy.isExistBalloon){
                        this.arr_Balloon[i].balloon_ClickBoom(this.candy);
                    }
                }
            }            
            Laya.timer.clear(this,this.candyTest);
            this.monster.monsterAction(GameConfig.ANI_MONSTER_EAT,true);
            this.candy.candyDestroy(this.monster.sp.x,this.monster.sp.y);
            
            Laya.timer.once(1250,this,this.showMenu);
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

    /**与泡泡的距离检测 */
    private testBalloon(x,y):void{
        if(!this.arr_Balloon) return;
        //检测与糖果得距离，碰撞到则启动泡泡效果,在GamePage中开启此检测方法，obj1为糖果的sprite
        let dic;
        if(!this.arr_Balloon) return;
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
        let dic;
        for(let i=0;i<this.arr_MagicHat.length;i++)
        {
            dic = this.countDic_Object({"x":this.candy.arr_Sp[0].x,"y":this.candy.arr_Sp[0].y},{"x":this.arr_MagicHat[i].sp.x,'y':this.arr_MagicHat[i].sp.y});
            if(dic < 50)
            {
                //使小球换位置出现的方法

            }
        }
        
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
                    this.monster.monsterAction(GameConfig.ANI_MONSTER_SAD,false);
                    Laya.timer.once(1250,this,this.onReGame);
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
        Laya.MouseManager.enabled = false;
        
        //比较之前在此关获得的星星，若比之前多则更新总分数
    }

     /**边界检测 */
    private testStage(x,y) : void
    {
        if(y<0||y>1334)
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
        if(this.isMouseDown)
        {
            let mX = Laya.stage.mouseX;
            let mY = Laya.stage.mouseY;
            this.arr_Rope.forEach(Rope => {
                if(!Rope.isCuted)
                {
                    for(let i=0;i<Rope.ropePointsArray.length;i++)
                    {
                        let ropePoint = Rope.ropePointsArray[i];
                        let f:any = {};
                        f.x = ropePoint.sp.x;
                        f.y = ropePoint.sp.y;
                        let s:any ={};
                        s.x = mX;
                        s.y = mY;
                        if(this.countDic_Object(f,s) < 20 && i < Rope.ropePointsArray.length )//优化绳子切割
                        {
                            if(ropePoint.sp.getComponent(Laya.RevoluteJoint))
                            {
                                ropePoint.sp.getComponent(Laya.RevoluteJoint).destroy();
                                Rope.ropeCuted();
                                break;
                            }
                        }
                    }
                }
            });
        }
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
}