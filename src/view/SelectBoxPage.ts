import {ui} from "../ui/layaMaxUI";
import {Box} from "./Box";
import ShopDialog from "./ShopDialog";

 /**
 * 
 */
export default class SelectBoxPage extends ui.SelectBox.SelectBoxUI
{
    /**季度数 */
    private quarter : number;
    /** 盒子 */
    private arr_Box : Array<Box>;
    /**点点 */
    private arr_Point : Array<Laya.Image>;
    /** 测试 - 盒子数量 */
    private boxCount : number;
    /**小怪兽 */
    public moster : any;
    /**起始点坐标 */
    private posX: number;
    /**滑动条数只保存 */
    private sliderKeep : number;
    /**当前滑动点 */
    private currentPoint : Laya.Image;
    /**比例设置 */
    private scale_ : number;
    /**商店 ui*/
    private shopDoor : ui.topLeftUI;
    /**dilog */
    private shopDialog : ShopDialog; 
    /**鼠标移动 */
    private mouseMoveX : number;
    /**当前下标 */
    private index : number;

    constructor(){
        super();
    }

    onAwake(){
        this.arr_Box = new Array<Box>() ;
        this.arr_Point = new Array<Laya.Image>();
        this.posX = 250;
        this.index = 0;
        
        this.btn_Exit.y =750*(Laya.Browser.clientHeight/Laya.Browser.clientWidth)-142;        
        this.shopDoor = new ui.topLeftUI();
        this.shopDialog = Laya.WeakObject.I.get("dialog");
        this.addChild(this.shopDoor);
        this.shopDoor.x = 0 ;
        this.shopDoor.y = 0;
        this.panel_ShowBox.hScrollBar.changeHandler =new Laya.Handler(this,this.scrollChange); 
        this.panel_ShowBox.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDow);
        this.on(Laya.Event.MOUSE_UP,this,this.onMouseUp);
        this.shopDoor.btn_Teach.on(Laya.Event.CLICK,this,this.onTeach);
        this.shopDoor.btn_Super.on(Laya.Event.CLICK,this,this.onSuper);
        
        this.btn_Exit.on(Laya.Event.CLICK,this,this.onEixt);
        this.btn_Exit.on(Laya.Event.MOUSE_DOWN,this,this.onDown);
        this.btn_Exit.on(Laya.Event.MOUSE_OUT,this,this.onUp);

        this.scrollBarSetting();
    }

    private onDown() : void
    {
        this.btn_Exit.skin = "publicAssets/exit_Y.png";
    }

    private onUp() : void
    {
        this.btn_Exit.skin = "publicAssets/exit_R.png";
    }


    private onTeach() :void
    {
        this.shopDialog.set(1,false);
    }

    private onSuper() :void
    {
        this.shopDialog.set(2,false);
    }


    private onEixt(e) : void
    {
        Laya.Scene.open("Select.scene",true);             
    }
    
    /**scrollBar 设置 */
    private scrollBarSetting() : void
    {
        this.panel_ShowBox.hScrollBar.visible = false;
        this.panel_ShowBox.hScrollBar.elasticDistance = 0;
        this.panel_ShowBox.hScrollBar.rollRatio = 0;
    }


    onEnable() : void
    {
        
    }

    onOpened(index) : void
    {
        this.quarter = index;
        this.createBox();
        this.addBoxEvent();
    }

    
    //盒子 102,29   50 = 200
    /**创建盒子UI */
    private createBox() : void
    {
        let box : Box;
        let img_Point : Laya.Image;
        this.boxCount = 5;//测试
        let skins = Laya.WeakObject.I.get("boxSkin");
        for(let i=0; i<this.boxCount;i++)
        {
            box = new Box(this,this.quarter,i,skins[this.quarter+"-"+i][0]);
            img_Point = new Laya.Image();
            img_Point.skin = "selectBox/point1.png";
            img_Point.x += 70 * i;
            this.sprite_SelectBox.addChild(img_Point);
            box.boxUI.x += (box.boxUI.width + 50)*i;
            this.arr_Point.push(img_Point);
            this.arr_Box.push(box);
            if(i == this.boxCount-1 )
            {
                box.boxUI.width += 125;
            }
        }
        this.setCurrentPoint(0);
        let lastBox = this.arr_Box[this.arr_Box.length-1];
        let lastPoint = this.arr_Point[this.arr_Point.length-1];
        this.scale_ = (lastPoint.x + lastPoint.width)/(lastBox.initX + lastBox.boxUI.x + lastBox.boxUI.width);
    }


    /**事件 面板被点下   2250*/
    private onMouseDow() : void
    {
        this.mouseMoveX = Laya.stage.mouseX;
    }


    /**时间 鼠标抬起 */
    private onMouseUp() : void
    {
        let value = this.panel_ShowBox.hScrollBar.value;
        let ca = this.mouseMoveX - Laya.stage.mouseX;
        let i = this.mouseJudge(value);
        if(ca > 100)
        {
            this.index++;
        }else if(ca <-100)
        {
            this.index--;
        }

        if(this.index == 0)
        {
            Laya.Tween.to(this.panel_ShowBox.hScrollBar,{value:0},100);
        }
        else
        {
            Laya.Tween.to(this.panel_ShowBox.hScrollBar,{value:(550*this.index - 20)},100);         
        }
    }

    /**面板滚动*/
    private scrollChange(value) : void
    {
        let box : ui.SelectBox.BoxUI;
        this.img_SelectBox.x = value*(this.scale_ + 0.0289) - 10;//0.289距离宽就变大，距离低就变小
        for(let i=0; i<this.arr_Box.length;i++)
        {
            if(value <= 130 - 5)
            {
                this.arr_Box[0].boxUI.sprite_BoxParent.addChild(this.moster);
                this.moster.x = 123;
                this.moster.y = 0;
                this.mosterMove(value,i);
                break;
            }
            else if(i!=0 && value <= (i*(550)+100 - 5) && value >= ((i-1)*550+160+this.posX + 5))
            {

                this.arr_Box[i].boxUI.sprite_BoxParent.addChild(this.moster);
                this.moster.x = 0;
                this.moster.y = 0;
                // console.log("变化"  +  i);
                this.mosterMove(value,i,(i-1)*550+100+this.posX);        
                break;
            }
            else
            {
                this.moster.removeSelf();
            }
        }
        this.setCurrentPoint(value);

    }
    /**怪物移动 */
    private mosterMove(value,i,mix?) : void
    {
        if(i == 0)
        {
            this.moster.x = value + 123;
        }
        else
        {
            this.moster.x = value - mix - 60;
        }
    }

    /**当前选择点 */
    private setCurrentPoint(value) : void
    {
        let i = this.mouseJudge(value);
        if(this.currentPoint != this.arr_Point[i])
        {
            if(this.currentPoint == null)
            {
                this.currentPoint = this.arr_Point[0];   
            }
            else
            {
                this.currentPoint.skin =  "selectBox/point1.png";
                this.currentPoint = this.arr_Point[i];
            }
            this.currentPoint.skin = "selectBox/point.png";
            this.img_SelectBox.zOrder = 10;
        }

        this.listPoint();
    }

    /**点点排版 */
    private listPoint() : void
    {
        for(let i=0;i<this.arr_Point.length ;i++)
        {
           this.arr_Point[i].y = 0;
           this.arr_Point[i].x = 0;
           this.arr_Point[i].x += 70 * i;
        }
        this.currentPoint.y = -15;
        this.currentPoint.x -= 10;
    }



    /**判断在哪个店 */
    private mouseJudge(value) : number
    {
        for(let i=0; i<this.arr_Box.length ; i++)
        {
            if(i==0 && value < 275)
            {
                return 0;
            }
            else if(value >= 275 + 550*(i-1) && value < 275 + 550*i)
            {
                return i;   
            } 
        }
    }

    /**事件绑定 给盒子 */
    private addBoxEvent() : void
    {
        for(let i=0; i<this.arr_Box.length; i++)
        {
            this.arr_Box[i].boxUI.img_box.on(Laya.Event.CLICK,this,this.clickBox,[i])
        }
        
    }

    /**事件 点击盒子 */
    private clickBox(index) : void
    {
        Laya.Scene.open("SelectRound/SelectRound.scene",true,[this.quarter,index]);        
    }    

}