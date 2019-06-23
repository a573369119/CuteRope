import {ui} from "../ui/layaMaxUI";
import { PlayerData } from "./Config/PlayerData";
 /**
 * 选择界面
 */
export default class SelectPage extends ui.SelectUI{

    constructor(){
        super();
    }

    onEnable() : void
    {
        this.btn_Exit.y =this.thisWidth.width*(Laya.Browser.clientHeight/Laya.Browser.clientWidth)-142;
        this.btn_First.on(Laya.Event.CLICK,this,this.onSelectBoxStart,[0]);
        this.btn_Second.on(Laya.Event.CLICK,this,this.onSelectBoxStart,[1]);
        this.btn_Third.on(Laya.Event.CLICK,this,this.onSelectBoxStart,[2]);
        this.btn_First_.on(Laya.Event.CLICK,this,this.onSelectBoxStart,[0]);
        this.btn_Second_.on(Laya.Event.CLICK,this,this.onSelectBoxStart,[1]);
        this.btn_Third_.on(Laya.Event.CLICK,this,this.onSelectBoxStart,[2]);
        this.btn_Exit.on(Laya.Event.CLICK,this,this.onExit);

        
        //鼠标点击效果
        this.btn_Exit.on(Laya.Event.MOUSE_DOWN,this,this.onDown,[0]);
        this.btn_Exit.on(Laya.Event.MOUSE_OUT,this,this.onUp,[0]);
        this.btn_First.on(Laya.Event.MOUSE_DOWN,this,this.onDown,[1]);
        this.btn_First_.on(Laya.Event.MOUSE_DOWN,this,this.onDown,[1]);
        this.btn_First.on(Laya.Event.MOUSE_OUT,this,this.onUp,[1]);
        this.btn_First.on(Laya.Event.MOUSE_OUT,this,this.onUp,[1]);
        this.btn_Second_.on(Laya.Event.MOUSE_DOWN,this,this.onDown,[2]);
        this.btn_Second.on(Laya.Event.MOUSE_DOWN,this,this.onDown,[2]);
        this.btn_Second_.on(Laya.Event.MOUSE_OUT,this,this.onUp,[2]);
        this.btn_Second.on(Laya.Event.MOUSE_OUT,this,this.onUp,[2]);
        this.btn_Third_.on(Laya.Event.MOUSE_DOWN,this,this.onDown,[3]);
        this.btn_Third.on(Laya.Event.MOUSE_DOWN,this,this.onDown,[3]);
        this.btn_Third_.on(Laya.Event.MOUSE_OUT,this,this.onUp,[3]);
        this.btn_Third.on(Laya.Event.MOUSE_OUT,this,this.onUp,[3]);
        
    }
    /**鼠标点下 */
    private onDown(i) : void
    {
        switch(i)
        {
            case 0:this.btn_Exit.skin = "publicAssets/exit_Y.png";break;
            case 1:this.btn_First_.skin = "select/sure.png";break;
            case 2:this.btn_Second_.skin = "select/sure.png";break;
            case 3:this.btn_Third_.skin = "select/sure.png";break;
            
        }
        
    }

    /**鼠标抬起 */
    private onUp(i) : void
    {
        switch(i)
        {
            case 0:this.btn_Exit.skin = "publicAssets/exit_R.png";break;
            case 1:this.btn_First_.skin = "select/s1s2sure.png";break;
            case 2:this.btn_Second_.skin = "select/s1s2sure.png";break;
            case 3:this.btn_Third_.skin = "select/s3sure.png";break;
            
            
        }
    }

    /*退出 */
    private onExit() : void
    {
        Laya.Scene.open("StartGame.scene",true,undefined,Laya.Handler.create(this,this.onOpen));      
          
    }
     /**按钮事件 进入季度关卡 */
     private onSelectBoxStart(index) : void
     {
        console.log("进入第：" + index + "季");
         //进入选择关卡
         if(Laya.WeakObject.I.get(index).selectLimit <= PlayerData.ins.starNum)
            Laya.Scene.open("SelectBox/SelectBox.scene",true,index,Laya.Handler.create(this,this.onOpen));
         else 
            alert("星星不够，需要" + Laya.WeakObject.I.get(index).selectLimit + "颗！");    
    }

    private onOpen() : void
    {
        this.destroy();
    }
}