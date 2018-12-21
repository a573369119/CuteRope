import {ui} from "../ui/layaMaxUI";
 /**
 * 选择界面
 */
export default class SelectPage extends ui.SelectUI{

    constructor(){
        super();
    }

    onEnable() : void
    {
        this.btn_First.on(Laya.Event.CLICK,this,this.onSelectBoxStart,[0]);
        this.btn_Second.on(Laya.Event.CLICK,this,this.onSelectBoxStart,[1]);
        this.btn_Third.on(Laya.Event.CLICK,this,this.onSelectBoxStart,[2]);
        this.btn_First_.on(Laya.Event.CLICK,this,this.onSelectBoxStart,[0]);
        this.btn_Second_.on(Laya.Event.CLICK,this,this.onSelectBoxStart,[1]);
        this.btn_Third_.on(Laya.Event.CLICK,this,this.onSelectBoxStart,[2]);
    }

     /**按钮事件 进入季度关卡 */
     private onSelectBoxStart(index) : void
     {
        console.log("进入第：" + index + "季");
         //进入选择关卡
         Laya.Scene.open("SelectBox/SelectBox.scene",true,[index]);
     }
}