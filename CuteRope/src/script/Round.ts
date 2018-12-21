/**
 * 旋转脚本
 * 
 */
export default class Round extends Laya.Script
{


    constructor(){
        super();
    }

    onEnable() : void
    {

    }

    onUpdate() : void
    {
        (this.owner as Laya.Sprite).rotation += 0.04;
    }
}