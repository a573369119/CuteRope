import {ui}         from "../ui/layaMaxUI";
import {Config}     from "../config/MapConfig";
import ShopDialog   from "./ShopDialog";
import Hook         from "../prefab/Hook";
import Rope         from "../prefab/Rope";
import Candy         from "../prefab/Candy";

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
//-----------------------------------------------
    /**是否返回 主页面 否则返回选择关卡 */
    private isMain : boolean;
//----------------------------------------------
    /**地图配置 */
    private mapConfig : Config.MapConfig;
    //hook 需要重置
    public arr_Hook:Array<Hook>=new Array<Hook>();
    //绳子  需要重置
    public arr_Rope : Array<Rope>;
    //糖果  不需要重置
    public candy : Candy;


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
        
        this.doorOpen.ani1.play(0,false);
        this.menuUI.visible = false;
        //添加事件
        this.addEvents();
        //第一次更新游戏
        this.UpdateData(this.quarterIndex+ "-" + this.boxIndex,this.cardIndex,true);
        //Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.check);
    }

    check():void{
        for(let i=0;i<this.mapConfig.arr_Hook.length;i++){
            this.mapConfig.arr_Hook[i];
        }
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
       this.addAnimationOver();
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
        switch(index)
        {
            case 1://用刀划开盒子
                this.afterCute();      
                break;
            case 2://用胶带封住盒子
                this.closeDoor();
                break
            case 3://吃到糖果显示计分板
                break;
            case 4:
                // this.doorOpen.visible = false;//关闭动画层
                break;
            //重新开始 或者 下一关。关闭计分板 打开箱子操作
            case 4:
                // this.doorOpen.visible = false;//关闭动画层
                break;
        }
    }

    /**事件 重玩 效果闪白光 ，重开*/
    private onReGame() : void
    {
        console.log("重玩");
        
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
        this.UpdateData("0-0",++this.cardIndex,false);
        // console.log("吃到糖果->下一关");
        // this.doorOpen.ani4.play(0,false);      
        // // AnimationManager.ins.stopAnimation(GameData.ANI_MONSTER_EAT);
        // for(let i=0;i<this.mapConfig.arr_Points.length;i++){
        //     this.mapConfig.arr_Points[i].point.visible=false;
        // }       
  
        // this.round++;
        // this.UpdateData("0-0",this.round,false);
     }

    /**事件 吃到糖果->重玩  效果开门重开 */
    private onReplay() : void
    {
        console.log("重玩  效果开门重开");

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
        this.doorOpen.ani2.play(0,false);
        // GameManager.ins_.getMediator(GameData.SELECT_ROUND_MEDIATOR).runRound();
    }

    /**事件 主界面 */
    private onMainMenu() : void
    {
        //跳到主界面    
        this.isMain = true;        
        this.doorOpen.visible = true;        
        this.doorOpen.ani2.play(0,false);
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
    /**鼠标点下 */
    private onMouseDown() : void
    {

    }
    /**鼠标抬起 */
    private onMouseUp() : void
    {

    }
    /**用刀划开盒子后 */
    private afterCute() : void
    {
        this.doorOpen.visible = false;//关闭动画层                
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

    /**吃到糖果显示计分板 */
    private showSocre() : void
    {

    }

////////////////////////////////////////////////界面逻辑处理
    private UpdateData(mapWhere:string,mapId:number,isNew:boolean) : void
    {
        this.mapConfig = Config.ConfigManger.ins.getMapConfig(mapWhere,mapId);
        console.log(this.mapConfig);
        //糖果数据初始化
        this.candyInit(this.mapConfig.candyConfig,this.mapConfig.arr_Rope.length);
        //钩子
        this.hookInit(this.mapConfig.arr_Hook);
        //绳子数据初始化
        this.ropeInit(this.mapConfig.arr_Rope,this.arr_Hook);
            //绳子寻找糖果
        Laya.timer.loop(1,this,this.ropeToCandy);
        // if(isNew)   this.mapopeToCandy();Config=LoadingManager.ins_.getMapConfig(mapWhere,mapId,this.view.panel_GameWorld,);  
        // else LoadingManager.ins_.getMapConfig(mapWhere,mapId,this.view.panel_GameWorld,this.mapConfig); //更新mapconfig操作     
        // this.getCandy();
        // this.contactHook();     	
        // Laya.timer.frameLoop(1,this,this.checkCandyPos);
        // Laya.timer.frameLoop(1,this,this.collisionCheckCandy);
        // Laya.timer.frameLoop(1,this,this.collisionCheckMonster);
        // Laya.timer.frameLoop(1,this,this.collisionCheckBalloon);
        // //怪兽
        // AnimationManager.ins.playAnimation(GameData.ANI_MONSTER_STAND,true,this.mapConfig.monster.x,this.mapConfig.monster.y,this.view.panel_GameWorld);    
        // for(let i=0;i<this.mapConfig.arr_Hook.length;i++){
        //     let hook=new Hook();
        //     hook.init(this.mapConfig.arr_Hook[i]);
            
        // } 
        
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
            obj.x = 10 * this.rotationDeal(rope.ropePointsArray[rope.ropePointsArray.length-1].sp.x,rope.ropePointsArray[rope.ropePointsArray.length-1].sp.y,this.candy.getCandySprite(0).x,this.candy.getCandySprite(0).y,"cos");
            obj.y = 10 * this.rotationDeal(rope.ropePointsArray[rope.ropePointsArray.length-1].sp.x,rope.ropePointsArray[rope.ropePointsArray.length-1].sp.y,this.candy.getCandySprite(0).x,this.candy.getCandySprite(0).y,"sin");
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
    
    /**糖果数据初始化 */
    private candyInit(candyConfig,num) : void
    {
        if(!this.candy) 
        {
            this.candy = new Candy();
            this.candy.init({"x":candyConfig.candy_X,"y":candyConfig.candy_Y,"style":candyConfig.style},num);
        }
        else
        {
            this.candy.update({"x":candyConfig.candy_X,"y":candyConfig.candy_Y,"style":candyConfig.style},num);
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
                this.arr_Hook[i] = new Hook();
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
            rope = new Rope();
            rope.init(arr_Hook[i].hook_X,arr_Hook[i].hook_Y,arr_Rope[i].num);
            this.arr_Rope.push(rope);
        }
        
    }
    


/////////////////////////////Tool
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