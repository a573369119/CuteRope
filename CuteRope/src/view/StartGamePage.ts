import {ui} from "../ui/layaMaxUI";
import GameConfig from "../GameConfig";

export default class StartGame extends ui.StartGameUI{

    constructor(){
        super();
    }

    onEnable() : void
    {
        this.btn_StartGame.on(Laya.Event.CLICK,this,this.onBtn);
        this.btn_Imgs.on(Laya.Event.CLICK,this,this.onBtn);
        this.btn_About.on(Laya.Event.CLICK,this,this.onBtn);        
        this.btn_StartGame.on(Laya.Event.MOUSE_DOWN,this,this.btnDown);
        this.btn_StartGame.on(Laya.Event.MOUSE_OUT,this,this.btnUp);
    }

    private btnDown() : void
    {
        this.btn_StartGame.skin = "publicAssets/btn2_2.png";
    }

    private btnUp() : void
    {
        this.btn_StartGame.skin = "publicAssets/btn1_2.png";   
    }

    private onBtn(e) : void
    {
        switch(e.target)
        {
            case this.btn_StartGame : Laya.Scene.open("Select.scene");break;
            case this.btn_Imgs : break;
            case this.btn_About : break;
        }
    }

}