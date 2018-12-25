import {ui} from "../ui/layaMaxUI";
import {Config} from "../config/MapConfig";
import ShopDialog from "./ShopDialog";

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


    
    //  /**mapConfig 根据传入的id获取地图配置 。示例      获取  LoadingManager.ins_.getMapConfig("2-1",3) 第2季，第1个盒子，第三个关卡  返回mapConfig里面又所有东西  */
    //  private mapConfig : MapConfig;


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
        this.doorOpen = new ui.GameView.GameViewDoorUI();
        this.menuUI = new ui.GameView.GameMenuUI();
        // ui初始化
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
        // if(isNew)   this.mapConfig=LoadingManager.ins_.getMapConfig(mapWhere,mapId,this.view.panel_GameWorld,);  
        // else LoadingManager.ins_.getMapConfig(mapWhere,mapId,this.view.panel_GameWorld,this.mapConfig); //更新mapconfig操作     
        // this.getCandy();
        // this.contactHook();     	
        // Laya.timer.frameLoop(1,this,this.checkCandyPos);
        // Laya.timer.frameLoop(1,this,this.collisionCheckCandy);
        // Laya.timer.frameLoop(1,this,this.collisionCheckMonster);
        // Laya.timer.frameLoop(1,this,this.collisionCheckBalloon);
        // //怪兽
        // AnimationManager.ins.playAnimation(GameData.ANI_MONSTER_STAND,true,this.mapConfig.monster.x,this.mapConfig.monster.y,this.view.panel_GameWorld);    
    }
}