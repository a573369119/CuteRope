/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import GamePage from "././view/GamePage"
import LoadingPage from "./view/LoadingPage"
import SelectPage from "./view/SelectPage"
import Round from "./script/Round"
import SelectBoxPage from "./view/SelectBoxPage"
import RoundPage from "././view/RoundPage"
import StartGamePage from "./view/StartGamePage"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=750;
    static height:number=1334;
    static scaleMode:string="exactfit";
    static screenMode:string="none";
    static alignV:string="bottom";
    static alignH:string="center";
    static startScene:any="Loading.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    //-------------------------动画名称-------------------
    /**[monster]糖果丢失， 伤心 15*/
    public static ANI_MONSTER_SAD : string = "no"; 
    /**[monster]糖果吃到，咀嚼 9 LOOP*/
    public static ANI_MONSTER_EAT : string = "eat";
    /**[monster]吃到星星，开心 19*/
    public static ANI_MONSTER_HAPPYE : string = "getStar";
    /**[monster]糖果靠近 张嘴 13*/
    public static ANI_MONSTER_OPEN : string = "open";
    /**[monster]动作 给我吃 26*/
    public static ANI_MONSTER_GIVE_ME : string = "giveMe";
    /**[monster]动作 随机 29*/
    public static ANI_MONSTER_GIVE_ME2 : string = "giveMe2_";
    /**[monster]站立 不动 17*/
    public static ANI_MONSTER_STAND : string = "stand";
    /**[monster]动作 翘脚 43*/
    public static ANI_MONSTER_ACTION : string = "action";
    //------------------------动画-------------------------
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("./view/GamePage.ts",GamePage);
        reg("view/LoadingPage.ts",LoadingPage);
        reg("view/SelectPage.ts",SelectPage);
        reg("script/Round.ts",Round);
        reg("view/SelectBoxPage.ts",SelectBoxPage);
        reg("./view/RoundPage.ts",RoundPage);
        reg("view/StartGamePage.ts",StartGamePage);
    }
}
GameConfig.init();