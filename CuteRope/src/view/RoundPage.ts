import {ui} from "../ui/layaMaxUI";
import ShopDialog from "./ShopDialog";
 /**
 * Round
 */
export default class RoundPage extends Laya.Scene{
    /**季度 */
    private quarterIndex : number;
    /**盒子 */
    private boxIndex : number;
    /**关卡配置文件 */
    private arr_Card : Array<any>;
    /**达到关卡数 从0开始*/
    private roundAt : number;
    /**商店 ui*/
    private shopDoor : ui.topLeftUI;
    /**dilaog */
    private shopDialog : ShopDialog;

    constructor(){
        super();
    }

    onEnable() : void
    {
    }
    
    onOpened(arr) : void
    {
        this.quarterIndex = arr[0];
        this.boxIndex = arr[1];
        this.arr_Card = new Array<ui.SelectRound.RoundItemUI>(); 
        this.shopDoor = new ui.topLeftUI();
        this.scene.addChild(this.shopDoor);
        this.shopDoor.x = 0 ;
        this.shopDoor.y = 0;
        this.Start();
    }

    private Start() : void
    {
        //初始化界面
        this.createUI();
        //事件绑定
        this.addEvents();
        //界面排版
        this.listUiItem();       
        //卡片显示状态
        this.showStyle();            
    }
    /**事件绑定 */
    private addEvents() : void
    {
        for(let i=0;i<this.arr_Card.length;i++)
        {
            this.arr_Card[i].on(Laya.Event.CLICK,this,this.onClick,[i])
        }

        this.scene.btn_Exit.on(Laya.Event.CLICK,this,this.onExit);

        this.shopDoor.btn_Teach.on(Laya.Event.CLICK,this,this.onTeach);
        this.shopDoor.btn_Super.on(Laya.Event.CLICK,this,this.onSuper);
    }


    private onTeach() :void
    {
        this.shopDialog.set(1,false);
    }

    private onSuper() :void
    {
        this.shopDialog.set(2,false);
    }


    private onExit() : void
    {
        Laya.Scene.open("SelectBox/SelectBox.scene",true,this.quarterIndex);
    }

    /**事件处理 */
    private onClick(index) : void
    {
        Laya.Scene.open("GameView/GameBackground.scene",true,[this.quarterIndex,this.boxIndex,index]);
    }


    /**UI创建 */
    private createUI() : void
    {
        let card : ui.SelectRound.RoundItemUI;

        for(let i=0 ; i<25; i++)
        {
            card = new ui.SelectRound.RoundItemUI();
            this.scene.addChild(card);
            this.arr_Card.push(card);
        } 
        this.shopDialog = Laya.WeakObject.I.get("dialog");
        
    }

    /**界面排版 */
    private listUiItem() : void
    {
        for(let i=0; i<this.arr_Card.length ;i++)
        {
            this.arr_Card[i].y = 300;
            this.arr_Card[i].x = 20;
            this.arr_Card[i].x += (i%5)*(this.arr_Card[i].width);
            this.arr_Card[i].y += Math.floor(i/5)*(this.arr_Card[i].height + 10);
        }
    }

    /**卡片状态 */
    public showStyle() : void
    {
        let thisCard = Laya.WeakObject.I.get(this.quarterIndex+"-"+this.boxIndex);
        if(thisCard)
        {//有
            this.showCard(thisCard);
        }
        else
        {//无
            this.closeCard();
        }
    }

    /**显示卡片状态 */
    private showCard(thisCard) : void
    {   
        for(let i=0;i<thisCard.length;i++)
        {
            if(this.arr_Card[i] != undefined)
            this.addRoundEvents(this.arr_Card[i],i);            
            if(thisCard[i] != -1)
            {
                this.arr_Card[i].img_Star.skin = this.setStars(thisCard[i]);
                this.setCount(i);
            }
            else
            {
                this.arr_Card[i].img_Star.skin = "selectRound/star0.png";
                this.setCount(i);
                for(let h=i+1;h<this.arr_Card.length;h++)
                {
                    this.arr_Card[h].img_Star.visible = false;
                    this.arr_Card[h].img_RoundBox.skin = "selectRound/lock.png";
                }
                break;
            }
        }
    }

    /**没有一个卡片处理方法 */
    private closeCard() : void
    {
        this.arr_Card.forEach(card => {
            card.img_Star.visible = false;
            card.img_RoundBox.skin = "selectRound/lock.png";
        });
    }
    /**加入 关卡事件 */
    private addRoundEvents(object,index) : void
    {
        object.on(Laya.Event.CLICK,this,this.onClickRound,[index]);
    }

    /**事件 点击关卡 */
    private onClickRound(index) : void
    {

    }

    /**卡牌星星和数字 处理 */
    private setStars(starsNum:number) : string
    {
        return "selectRound/star" + starsNum + ".png";
    }

    /**数字的处理 */
    private setCount(index:number) : void
    {
        if(index + 1 >= 10)
        {
            this.arr_Card[index].img_Count1.visible = true
            this.arr_Card[index].img_Count1.skin = "publicAssets/" + Math.floor((index + 1)/10) + ".png";
            this.arr_Card[index].img_Count2.skin = "publicAssets/" + (index + 1)%10 + ".png";       
         }
         else
         {
            this.arr_Card[index].img_Count2.skin = "publicAssets/" + (index + 1) + ".png";                    
         }
    }   
}