import { PlayerData } from "../view/Config/PlayerData";

/**
 * 用户的星星数量
 */
export default class PlayerStar extends Laya.Script{
    private playerStarNum;

    constructor(){
        super();
    }

    onAwake(){
        this.playerStarNum = PlayerData.ins.starNum;
        this.init();
    }

    private init() : void
    {
        let ge  = this.owner.getChildByName("ge");
        let shi = this.owner.getChildByName("shi");
        let bai = this.owner.getChildByName("bai");
        //逻辑
        let count_ge;
        let count_shi = -1;
        let count_bai = -1;
        count_ge = this.playerStarNum%10;
        count_shi = (Math.floor(this.playerStarNum/10)%10);
        count_bai = (Math.floor(this.playerStarNum/100)%10);

        (shi as Laya.Image).visible = false;
        (bai as Laya.Image).visible = false;
        (ge as Laya.Image).skin = "publicAssets/" + count_ge + ".png";
        if(this.playerStarNum >= 10)
        {
            (shi as Laya.Image).skin = "publicAssets/" + count_shi + ".png";
            (shi as Laya.Image).visible = true;            
        }
        if(this.playerStarNum >= 100)
        {
            (bai as Laya.Image).skin = "publicAssets/" + count_bai + ".png";
            (bai as Laya.Image).visible = true;            
        }
    }
}