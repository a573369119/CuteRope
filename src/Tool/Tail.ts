/**
 * 
 * new -> init ->setSingle -> start
 * 
 * 鼠标拖尾 【1】圆形拖尾 图片拼贴  测试图片skin:assate/suca2.png
 */
export default class Tail{
    /**生成间隙 单位像素*/
    private createDic : number;
    /**完全消失 所需时间 */
    private destoryTime : number;
    ///----------------------------------
    private skinCirle : string; //单图片拖尾（圆形）
    ///----------------------------------
    /**鼠标控制 */
    private isDown : boolean;
    /** */
    private spriteImgs : Laya.Sprite;
    /**可拖尾界面**/
    private view : any;
    /**路径数组 */
    private arr_RodePos : Array<any>; 
    /**前一坐标记录 */
    private rem_LastPos : any;
    /**末尾形态处理 索引 */
    private index_Img : number;
    /**已使用长度 */
    private index_ImgUsed : number;
    /**图片对象数组 */
    private arr_Imgs : Array<any>;
    //****位置差 */
    private _x : number;
    private _y : number;

    /**
     * view:可拖尾sprite层   
     * 先init 再set 再Start
     * */
    constructor(view){
        this.view = view;
    }

    /** 
     *   
     * *createTime:生成间隙  
     * *destoryTime:完全消失所需时间
     * 
     * */
    public Init(createTime,destoryTime) : void
    {
        this.createDic = createTime;
        this.destoryTime = destoryTime;

        this.arr_RodePos = new Array<any>();
        this.arr_Imgs = new Array<Laya.Image>();
        this.rem_LastPos = {x:null,y:null};
        this.spriteImgs = new Laya.Sprite();
        this.view.addChild(this.spriteImgs);

        this.index_Img = 0;
        this.index_ImgUsed = 0;
        this._x = 0;
        this._y = 0;
    }

    /**
     * 【1】设置 单图片圆形拖尾     
     * *skin : 图片的地址
     * 
     * */
    public setSingle(skinType:string,skin : string) : void
    {
        switch(skinType)
        {
            case "cirle":
                this.skinCirle = skin;
                break;
        }
    }

    private addEvents() : void
    {
        this.view.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDow);
        this.view.on(Laya.Event.MOUSE_UP,this,this.onMouseUp);
        Laya.timer.loop(1,this,this.tailRun);
    }

    private removeEvens() : void
    {
        this.view.off(Laya.Event.MOUSE_DOWN,this,this.onMouseDow);
        this.view.off(Laya.Event.MOUSE_UP,this,this.onMouseUp);
        Laya.timer.clear(this,this.tailRun);       
    }

    /**
     * 鼠标侦测 按下
     * */
    private onMouseDow() : void
    {   
        this.isDown = true;
    }

    /**
     * 鼠标侦测 抬起
     * 
     * */
    private onMouseUp() : void
    {
        this.isDown = false;
        this.rem_LastPos.x = null;
        this.rem_LastPos.y = null;
    }


    /**
     * 拖尾 run
     * 
     * */
    private tailRun() : void
    {
        //运行单图圆形拖尾
        if(this.skinCirle) this.cirleTailRun();
    }



    /**
     * 开始拖尾效果
     * 
     * */
    public start() : void
    {
        this.addEvents(); 
    }

    /**
     * 取消拖尾效果
     *  
     * */
    public stop() : void
    {
        this.removeEvens();
    }

/////////////////////////////////////////////单图片圆形拖尾逻辑↓
    private cirleTailRun() : void
    {
        let mX = Laya.stage.mouseX;
        let mY = Laya.stage.mouseY;
        // console.log("拖尾");
        if(this.isDown)
        {
            // console.log("记录");
            //记录
            this.rem_Pos(mX,mY);
        }
        // console.log("显示");
        this.changeStyle();
    }
/////////////////////////////////////////////单图片圆形拖尾逻辑↑


/////////////////////////////////////////////公用处理方法
    /**
     * 改变状态
     */
    private changeStyle() : void
    {
        if(this.arr_Imgs.length > 0 )
        {
            this.index_Img = this.index_ImgUsed;//
            let len : number;
            let img : Laya.Image;
            while(this.arr_Imgs[this.index_Img] != undefined)
            {   
                len = this.arr_Imgs.length - this.index_Img;
                // console.log("【下标】：" + this.index_Img + "  【最近位置】：" + this.index_ImgUsed);
                img = this.arr_Imgs[this.index_Img];
                img.scaleX += -this.getScale(len,(len - (this.index_Img - this.index_ImgUsed))/len);
                img.scaleY += -this.getScale(len,(len - (this.index_Img - this.index_ImgUsed))/len);       
                img.alpha += -this.getScale(len,(len - (this.index_Img - this.index_ImgUsed))/len);         
                this.index_Img++;
                if(img.scaleX < 0.05)
                {
                    Laya.Pool.recover("cirleTail",img);
                    // console.log("收入对象池");
                    this.index_ImgUsed++;                
                }
            }
        }
        if(this.arr_Imgs.length == this.index_ImgUsed && this.arr_Imgs.length != 0)
        {
            this.arr_RodePos = [];
            this.arr_Imgs = [];
            this.index_Img = 0;
            this.index_ImgUsed = 0;
        }
    }


    /**缩放逻辑  number是 每个图片的特殊标量*/
    private getScale(len,scale_number) : number
    {
        let num = 0.1;
        if(len > 8)
        {
            //加速
            return num * scale_number;
        }
        else
        {
            return 0.05;
        }
    }
    /**
     * 位置差
     */
    public setPosX(x,y) : void
    {
        this._x = x;
        this._y = y;
    }

    /**
     * 队列记录坐标点  
     * mX 鼠标当前X坐标  
     * mY鼠标当前Y坐标
     * */
    private rem_Pos(mX,mY) : void
    {
        if(this.rem_LastPos.x == null || this.rem_LastPos.y == null)//初始记录
        {
            this.rem_LastPos.x = mX;
            this.rem_LastPos.y = mY;
        }
        else
        {
            let dic = this.countDic_Point(mX,mY,this.rem_LastPos.x,this.rem_LastPos.y);
            if(dic > this.createDic)
            {
                let pos : any ={};
                //空隙补全
                let count;
                // if(dic > 50)
                // {
                //     count  = Math.floor(dic/50);
                //     let cos = this.rotationDeal(this.rem_LastPos.x,this.rem_LastPos.y,mX,mY,"cos");
                //     let sin = this.rotationDeal(this.rem_LastPos.x,this.rem_LastPos.y,mX,mY,"sin");
                //     for(let i = 1; i<=count ; i++)
                //     {
                //         let pos : any= {};
                //         this.arr_RodePos.push({x:this.rem_LastPos.x + 50 * i * cos,y:this.rem_LastPos.y + 50 * i * sin});
                //         if(this.skinCirle) this.showSingleCirle();
                //     }
                // }
                pos.x = mX + this._x;
                pos.y = mY + this._y;
                this.arr_RodePos.push(pos);
                if(this.skinCirle) this.showSingleCirle();
                this.rem_LastPos.x = mX;
                this.rem_LastPos.y = mY;
                    // console.log(this.arr_RodePos);
                 //显示
                //  console.log(this.arr_RodePos);
            }
        }
    }


    /**角度处理函数
     * 
     *  传入 碰撞物体
     * 
     *  获取正选 或余弦  或正切
     * 
     *  返回 对应值
     * 
     *  sin  对边/斜边
     *  cos  临边/斜边
     *  tan  对边/临边
     * */
    private rotationDeal(x1,y1,x2,y2,getString) : number
    {
        /**斜边 */
        let c : number = Math.sqrt(Math.pow(x1 - x2,2) + Math.pow(y1 - y2,2));
        /**临边 */
        let a : number = x1 - x2;
        /**对边 */
        let b : number = y1 - y2;

        if(getString == "sin")
        {
            //console.log("#sin ==" + (b/c));
            return (b/c);
        }
        else if(getString == "cos")
        {
            //console.log("#cos ==" + (a/c));
            return (a/c);
        }
        else
        {
            //console.log("#tan ==" + (b/a));//对边 比 临边 
            return (b/a);
        }
    }

    /***
     * 距离计算 
     * 两点之间 
     * pos1点1
     * pos2点2
     */
    private countDic_Object(pos1,pos2) : number
    {
        return Math.sqrt(Math.pow(pos1.x - pos2.x,2) + Math.pow(pos1.y - pos2.y,2));
    }
    /***
     * 距离计算 
     * 两点之间 
     */
    private countDic_Point(x1,y1,x2,y2) : number
    {
        return Math.sqrt(Math.pow(x1 - x2,2) + Math.pow(y1 - y2,2));
    }

    /**显示逻辑 */
    private showSingleCirle() : void
    {
        this.getTail();
    }

    /**获取尾巴 */
    private getTail() : void
    {
        let img = Laya.Pool.getItem("cirleTail");
        if(!img)
        {
            img = this.newImage();
        }
        else
        {
            if((img as Laya.Image).parent != this.spriteImgs)
            {
                (img as Laya.Image).removeSelf();
                this.spriteImgs.addChild(img);
            }

        }
        //加入队列
        this.arr_Imgs.push(img);
        // console.log("【arr_img】::" + this.arr_Imgs.length);
        this.initImage(img);
    }
    /**
     * 初始化尾巴
     */
    private initImage(img:Laya.Image) : void
    {
        
        img.x = this.arr_RodePos[this.arr_RodePos.length - 1].x;
        img.y = this.arr_RodePos[this.arr_RodePos.length - 1].y;
        img.scale(1,1);
        img.alpha = 1;
        // (this.view as Laya.Sprite).cacheAsBitmap = true;
    } 

    /**
     * 新建 拖尾图片 
     * 
     * */
    private newImage() : Laya.Image
    {
        let img : Laya.Image;
        img = new Laya.Image();
        img.zOrder = 10;
        this.spriteImgs.addChild(img);
        if(this.skinCirle) img.skin = this.skinCirle;
        img.pivotX = img.width/2,
        img.pivotY = img.height/2;
        return img;
    }
}