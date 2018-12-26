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