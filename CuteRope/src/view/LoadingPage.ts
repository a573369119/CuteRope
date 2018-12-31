import {ui} from "../ui/layaMaxUI";
import GameConfig from "../GameConfig";
export default class LoadingPage extends ui.LoadingUI{
      
    constructor(){
        super();
    }

    onEnable() : void
    {
        let src = [
            {url:"res/atlas/publicAssets.atlas"},
            {url:"res/atlas/selectBox.atlas"},
            {url:"res/atlas/selectRound.atlas"},
            {url:"res/atlas/select.atlas"},
            {url:"res/atlas/gameView.atlas"},
            {url:"res/atlas/gameView/gameBg.atlas"},
            {url:"res/atlas/gameView/gameDoor.atlas"},
            {url:"res/atlas/gameView/gamePos.atlas"},
            {url:"res/atlas/gameView/gameBtn.atlas"},
            //大图加载
            {url:"unpackage/startGameBg.jpg"},
            {url:"unpackage/cutRope.png"},
            {url:"GameView/gameBg/boxBg_1.jpg"}
        ];
        Laya.loader.load(src,Laya.Handler.create(this,this.onLoad),Laya.Handler.create(this,this.onPro));
    }


    private onLoad() : void
    {
        this.lab_Progress.text = "加载完成，进入游戏";
        Laya.Scene.open("StartGame.scene");
    }

    private onPro(pro) : void
    {
        console.log(pro);
        this.lab_Progress.text = "Loading …… " + Math.floor(pro) + "%";
        this.img_Progress.width = 499 * pro; 
    }
}