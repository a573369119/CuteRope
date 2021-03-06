import GameConfig from "../config/GameConfig";
import RopePoint from "./RopePoint";
import Tool from "../Tool/Tool";
import Dic from "../Tool/dic";

export default class Hook{
    /**横坐标 */
	public hook_X:number;
	/**纵坐标 */
    public hook_Y:number;
    /**钩子类型 */
    public style : string;
    /**精灵 */
    public sp:Laya.Sprite;
    /**旋转精灵 */
    public rotateSp : Laya.Sprite;
    /**画圈 */
    public spp:Laya.Sprite;
    /**滑动条 */
    public sp_Silder : Laya.Sprite;
    /**滑动条 */
    public arr_img : Array<Laya.Image>;
    /**所在层 */
    private view : Laya.Panel
    /**是否已创建 */
    public isCreate : boolean;
    /**范围 */
    public size : number;
    /**Top */
    public imgTop : Laya.Image;
    /**旋转hookImg */
    public imgTopRotate : Laya.Image;
    /**角度 */
    public rotation : number;
    /**长度 */
    public length : number;
    /**滑动点所占百分比 */
    public percent : number;
    /**是否可移动 */
    public isDown : boolean;
    /**绳子第一个节点*/
    public ropePoint : RopePoint;
    public arr_ropePoint : Array<RopePoint>;
    /**鼠标x，y记录 */
    private rem_x : number;
    private rem_y : number;
    /**屏幕长宽 */
    private screenX : number;
    private screenY : number;
    public canRotate : boolean;
    /**旧的坐标点 */
    public oldPos : any;
    /**计数点 */
    public countRotation : number;

    constructor(view){
        this.view = view;
    }

    //初始化,"hook1"为钩子风格1，"hook2"为钩子风格2，检测糖果是否在设定范围内，如果在就生成新的绳子
    init(data,canRotate,size?):void{
        this.canRotate = canRotate;
        this.isDown = false;
        this.isCreate = false;     
        this.arr_ropePoint = [];
        this.setValue(data,size);
        this.hook_CreateSprite(data.hook_X,data.hook_Y,data.style);        
        if(data.style == "hook2")/////////没有图片
        {
            this.createSpp();
        }
        this.createSilder();
    }
    
    //更新状态
    update(data,canRotate,size?):void{
        
        this.canRotate = canRotate;
        this.isCreate = false; 
        this.sp.visible = true;
        this.imgTop.visible = true;
        this.setValue(data, size);   
        this.setHookTop(data.hook_X,data.hook_Y)    
        if(data.style == "hook2")/////////没有图片
        {
            if(this.spp)
            {
                this.spp.visible = true;
                this.spp.width = this.size*2;
                this.spp.height = this.size*2;
                this.spp.pivot(this.spp.width/2,this.spp.height/2);
                this.spp.pos(0,0);
            }
            else
            {
                this.createSpp();
            }
        }
        else
        {
            if(this.spp)
            {
                this.spp.visible = false;
            }
        }
        this.sp.pos(data.hook_X,data.hook_Y);
        this.createSilder();

    }
    //创建圈
    private createSpp() : void
    {
        this.spp = new Laya.Image();
        this.spp.loadImage("gameView/ropeRage.png");
        this.spp.width = this.size*2;
        this.spp.height = this.size*2;
        this.spp.pivot(this.spp.width/2,this.spp.height/2);
        this.sp.addChild(this.spp);
    }

    private setValue(data: any, size: any) {
        this.hook_X = data.hook_X;
        this.hook_Y = data.hook_Y;
        this.style = data.style;
        this.size = size;
        this.rotation = data.rotation;
        this.length = data.length;
        this.percent = data.percent;
        
    }

    //创建钩子精灵
    hook_CreateSprite(x,y,style){
        this.sp=new Laya.Sprite();
        //hook图片
        this.setHookBottom();
        //Hook顶部
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
        this.setHookTop(x, y);
        // this.sp.loadImage("gameView/"+"hook1"+".png");
        // this.sp.loadImage("gameView/"+style+".png");
        this.sp.zOrder = GameConfig.ZORDER_ROPEPOINT;
        this.sp.pos(x,y);
        this.view.addChild(this.sp);
    }

    private setHookBottom() {
        let img = new Laya.Image();
        img.loadImage("gameView/" + "hook1" + ".png");
        img.size(50,50);
        img.pivot(50 / 2, 50 / 2);
        img.pos(0, 0);
        // this.sp.width = img.width;
        // this.sp.height = img.height;
        this.sp.addChild(img);
        return img;
    }

    private setHookTop(x: any, y: any) {
        if(!this.imgTop)
        {
            this.imgTop = new Laya.Image();
            this.view.addChild(this.imgTop);
        }        
        this.imgTop.visible = true;
        this.imgTop.skin ="gameView/hookTop.png";
        this.imgTop.size(20,20);
        this.imgTop.pivot(20 / 2, 20 / 2);
        this.imgTop.pos(x, y);
        // this.imgTop.pos(0, 0);
        if(this.canRotate)
        {
            if(!this.imgTopRotate)
            {
                this.rotateSp = new Laya.Sprite();
                this.sp.addChild(this.rotateSp);
                this.oldPos = {};
                this.imgTopRotate = new Laya.Image();
                this.rotateSp.addChild(this.imgTopRotate);
            }  
            this.imgTop.visible = false;
            ///rotatesp 设置
            this.rotateSp.size(100,100);
            this.rotateSp.pivot(this.imgTop.width/2 + 30,this.imgTop.height/2 + 29);
            this.rotateSp.pos(0,+4);
            this.rotateSp.zOrder = GameConfig.ZORDER_HOOK_TOP;
            ///imgTop setting
            this.imgTopRotate.visible = true;
            this.imgTopRotate.skin = "gameView/rotateHook.png";
            this.imgTopRotate.size(100,100);
            this.imgTopRotate.pivot(this.imgTop.width/2,this.imgTop.height/2);
            this.imgTopRotate.pos(0,0);
            this.imgTopRotate.hitTestPrior = true;
            this.imgTopRotate.zOrder = GameConfig.ZORDER_HOOK_TOP;
            // Laya.timer.loop(50,this,this.rotateHook);
        }
        else
        {
            if(this.imgTopRotate) this.imgTopRotate.visible = false;
        }
        this.imgTop.zOrder = GameConfig.ZORDER_HOOK_TOP;
    }

    /**创建滑动条 */
    public createSilder() : void
    {
        if(this.length)
        {
            if(!this.sp_Silder)
                this.createImage();
            else
            {
                this.arr_img[0].visible = true;
                this.arr_img[1].visible = true;
                this.arr_img[2].visible = true;
                this.setSilder();
                this.setImgValue();
            }
            this.addEvent();
            // this.addMouseJoint();
        }
    }

    /**创建滑动图片 */
    private createImage() : void
    {
        this.sp_Silder = new Laya.Sprite();
        this.arr_img = new Array<Laya.Image>();
        this.arr_img[0] = new Laya.Image();
        this.arr_img[1] = new Laya.Image();
        this.arr_img[2] = new Laya.Image();
        //左
        this.arr_img[0].loadImage("gameView/hookslider_root1.png");
        this.arr_img[0].width = 24;
        this.arr_img[0].height = 49;
        //中
        this.arr_img[1].loadImage("gameView/hooksliderbg.png");
        //右
        this.arr_img[2].loadImage("gameView/hookslider_root2.png");
        this.arr_img[2].width = 24;
        
        //属性设置
        this.setImgValue();
        //
        this.view.addChild(this.sp_Silder);
        this.setSilder();
    }
    /**设置属性值 */
    private setImgValue() : void
    {
        let len = this.length - this.arr_img[0].width*2;//滑动背景
        let x = 0;
        this.arr_img[1].width = len;
        for(let i=0;i<this.arr_img.length;i++)
        {
            this.sp_Silder.addChild(this.arr_img[i]);            
            if(this.arr_img[i-1])
            {
                x += this.arr_img[i-1].width - 3;
                this.arr_img[i].x = x;
            }
            else
            {
                this.arr_img[i].x = 0;
            }
        }
    }
    /***只是滚动条属性 */
    private setSilder() : void
    {
        this.sp_Silder.pivot(this.arr_img[0].width, this.arr_img[0].height/2);
        this.sp_Silder.pos(this.sp.x,this.sp.y);
        this.sp_Silder.rotation = this.rotation;
        this.imgTop.size(68,68);
        this.imgTop.pivot(this.imgTop.width/2+2,this.imgTop.height/2-4);
        this.imgTop.skin = "gameView/hookslider.png";
        if(this.rotation == 0)
        {
            this.sp.x += ((this.length - this.arr_img[0].width*2) * this.percent); 
            this.imgTop.x += ((this.length - this.arr_img[0].width*2) * this.percent);      
        }
        else
        {
            this.sp.y -= (this.length - this.arr_img[0].width*2) * (this.percent);
            this.imgTop.y -= (this.length - this.arr_img[0].width*2) * (this.percent);
        }
    }
    /**设置滑动条绑定绳子 */
    public setRopePoint(ropePoint) : void
    {
        this.arr_ropePoint.push(ropePoint);
        if(this.percent !== undefined) Laya.timer.loop(1,this,this.followHook);
    }

    /**绑定绳子 */
    public setHookRopePoint(ropePoint) : void
    {
        this.ropePoint = ropePoint;
        this.arr_ropePoint.push(ropePoint);
    }

    private followHook() : void
    {
        for(let i=0;i<this.arr_ropePoint.length;i++)
        {
            let ropePoint = this.arr_ropePoint[i];
            if(ropePoint.sp.alpha < 1)
            {
                Laya.timer.clear(this,this.followHook);
            }
            // this.ropePoint.sp.x = this.imgTop.x;
            // this.ropePoint.sp.y = this.imgTop.y;
            if(this.rotation == 0)
            {
                // console.log(Math.abs(this.ropePoint.sp.x - this.imgTop.x));
                if(Math.abs(ropePoint.sp.x - this.imgTop.x) >5)
                {
                    let dic = ropePoint.sp.x - this.imgTop.x;
                    if(dic > 0)
                    {//左
                        ropePoint.sp.getComponents(Laya.RigidBody)[0].linearVelocity = {x:-12,y:0};
                    }
                    else
                    {//右
                        ropePoint.sp.getComponents(Laya.RigidBody)[0].linearVelocity = {x:12,y:0};
                    }
                }
                else
                {
                    ropePoint.sp.getComponents(Laya.RigidBody)[0].linearVelocity = {x:0,y:0};

                }
            }
            else
            {
                if(Math.abs(ropePoint.sp.y - this.imgTop.y) >5)
                {
                    let dic = ropePoint.sp.y - this.imgTop.y;
                    if(dic > 0)
                    {//上
                        ropePoint.sp.getComponents(Laya.RigidBody)[0].linearVelocity = {x:0,y:-12};
                    }
                    else
                    {//下
                        ropePoint.sp.getComponents(Laya.RigidBody)[0].linearVelocity = {x:0,y:12};
                    }
                }
                else
                {
                    ropePoint.sp.getComponents(Laya.RigidBody)[0].linearVelocity = {x:0,y:0};
                }
            }
        }
        
    }

    /**添加事件 */
    private addEvent() : void
    {
        this.imgTop.on(Laya.Event.MOUSE_DOWN,this,this.imgDown);
        Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.followMouse);
        Laya.stage.on(Laya.Event.MOUSE_UP,this,this.mouseUp);
    }

    /**跟随鼠标 */
    private followMouse() : void
    {
        if(!this.isDown) return ;
        // console.log(this.imgTop.y);
        let mX = Laya.stage.mouseX - GameConfig.CaX;
        let mY = Laya.stage.mouseY - GameConfig.CaY;
        let dicX = mX - this.hook_X;
        let dicY = mY - this.hook_Y;
        if(this.rotation == -90 || this.rotation == 0)
        {
            dicX = dicX * Math.cos(this.rotation/360*2*Math.PI);
            dicY = -dicY * Math.sin(this.rotation/360*2*Math.PI);
            if(mX >= this.hook_X && mX <= this.hook_X + this.length - this.arr_img[0].width*2 )
            {
                this.imgTop.x = this.hook_X + dicX+3;
                this.sp.x = this.hook_X + dicX;
            }
            if(mY <= this.hook_Y && mY >= this.hook_Y - this.length + this.arr_img[0].width*2)
            {
                this.imgTop.y = this.hook_Y + dicY-3;
                this.sp.y = this.hook_Y + dicY;
            }
        }
        else
        {
        }
    
    }
    /**鼠标抬起*/
    private mouseUp() : void
    {
        this.isDown = false;
        this.rem_x = undefined;
        this.rem_y = undefined;
    }

    /**图片被点下 */
    private imgDown() : void
    {
        this.isDown = true;   
    }

    /**销毁处理 */
    public hookDestroy() : void
    {
        this.oldPos = {};
        this.sp.visible = false;
        this.isCreate = false;
        this.sp.x = 10000;
        if(this.rotateSp) this.rotateSp.rotation = 0;
        this.imgTop.visible = false;
        this.isDown = false;
        this.length = undefined;
        this.rotation = undefined;
        this.canRotate = false;
        this.imgTop.skin = "gameView/hookTop.png";
        this.imgTop.size(20,19);
        // this.spp.pos(0,0);
        if(this.arr_img)
            this.arr_img.forEach(img => {
                img.visible = false;
            });
        Laya.timer.clear(this,this.followMouse);
        Laya.timer.clear(this,this.followHook);
        this.imgTop.off(Laya.Event.MOUSE_DOWN,this,this.imgDown);
        Laya.stage.off(Laya.Event.MOUSE_MOVE,this,this.followMouse);
        Laya.stage.off(Laya.Event.MOUSE_UP,this,this.mouseUp);
        this.arr_ropePoint = [];
    }

    /**hook旋转逻辑 鼠标x y*/
    public mouseRotateHook(x,y) : number
    {
        x = x - this.hook_X;
        y = y - this.hook_Y;
        if(this.oldPos.x == undefined || this.oldPos.y == undefined)
        {
            this.oldPos.x = x;
            this.oldPos.y = y;
            this.countRotation = 0;
            return;
        }
        let fM = Math.sqrt(Math.pow(x,2)+Math.pow(y,2))*Math.sqrt(Math.pow(this.oldPos.x,2)+Math.pow(this.oldPos.y,2));
        let fZ = x*this.oldPos.x + y*this.oldPos.y;
        let rotation = Math.acos(fZ/fM)*180/Math.PI;
        // console.log("【rotation】" + rotation);
        // console.log(rotation +  " [rotation] " + this.rotateSp.rotation + "[fM]" + fM + "[fZ]" + fZ);
        // console.log(this.rotateSp.rotation)
        // console.log("[x]"　+ x + "[y]" + y + "[oldx]" + this.oldPos.x + " [oldy]" + this.oldPos.y + "[cos]" + fZ/fM);
        // console.log("old.x:[" + this.oldPos.x + "]  old.y:[" + this.oldPos.y + "]       " + "x:["+x+"],y:["+y+"]");
        let num = this.judge(x,y,this.oldPos);
        // console.log("【num:】" + num);
        this.oldPos.x = x;
        this.oldPos.y = y;
        if(fM > fZ && num) 
        {
            this.rotateHook(num*rotation);
            this.countRotation += num*rotation;
        }
        if(Math.abs(this.countRotation) > 30)
        {
            let count = this.countRotation;
            this.countRotation = 0;
            return count;
        }
        return ;
    }

    /**正负判断 */
    private judge(x,y,oldPos) : number
    {
        let cZ : any = {};
        let num;
        cZ.x = 1/oldPos.x;
        cZ.y = -1/oldPos.y;
        if(oldPos.x == 0)
        {
            cZ.x = 1;
            cZ.y = 0;
        }
        if(oldPos.y == 0)
        {
            cZ.x = 0;
            cZ.y = 1;
        }
        num = cZ.x*x+cZ.y*y;
        // console.log("[x]" + cZ.x*x + "[y]" + cZ.y*y);8
        if((x) >= 0 && (y) <0 || (x) <= 0 && (y) >0)
        {
            num = -num;
            console.log("【"+num+"】");
        }
        if(num > 0) return -1;
        return 1;
    }


    /**hook旋转 */
    private rotateHook(rotation) : void
    {
        // console.log("【转】:" + rotation);
        this.rotateSp.rotation +=rotation;     
    }


    ////////////////////////////////////BEE
    public followBee(nextPos,rotation) : void
    {
        this.sp.x = nextPos.x;
        this.sp.y = nextPos.y;
        this.imgTop.x = nextPos.x;
        this.imgTop.y = nextPos.y;
        // ropePoint.sp.x = nextPos.x;
        // ropePoint.sp.y = nextPos.y;
        this.arr_ropePoint.forEach(ropePoint => {
            if(ropePoint)
            {
                if(ropePoint.body)
                {
                    this.ropeFollowBee(nextPos,ropePoint);
                }
            }
        });
    }

    private ropeFollowBee(nextPos,ropePoint) : void
    {
        let currentPos = {x:ropePoint.sp.x,y:ropePoint.sp.y};
        let cos = Tool.rotationDeal(nextPos.x,nextPos.y,currentPos.x,currentPos.y,"cos");
        let sin = Tool.rotationDeal(nextPos.x,nextPos.y,currentPos.x,currentPos.y,"sin");
        if(Dic.countDic_Object(nextPos,ropePoint) < 10) 
        {
            (ropePoint.body as Laya.RigidBody).linearVelocity = {x:0,y:0};
            return;
        }
        (ropePoint.body as Laya.RigidBody).linearVelocity = {x:6.5*-cos,y:6.5*-sin};
    }


    public toHook() : void
    {
        Laya.timer.loop(16,this,this.toHookPos);
    }

    private toHookPos() : void
    {
        this.arr_ropePoint.forEach(ropePoint => {
            if(ropePoint)
            {
                if(ropePoint.body)
                {
                    let currentPos = {x:ropePoint.sp.x,y:ropePoint.sp.y};
                    let cos = Tool.rotationDeal(this.sp.x,this.sp.y,currentPos.x,currentPos.y,"cos");
                    let sin = Tool.rotationDeal(this.sp.x,this.sp.y,currentPos.x,currentPos.y,"sin");
                    if(Dic.countDic_Object(currentPos,this.sp) < 5)
                    {
                        Laya.timer.clear(this,this.toHookPos);
                        ropePoint.body.linearVelocity = {x:0,y:0};
                    }
                    else
                    {
                        ropePoint.body.linearVelocity = {x:4*-cos,y:4*-sin};
                    }
                }
            }
        });
    }


/////////////////////////////////////////////////////cd
    public removAddSelf(sp) : void
    {
        this.sp.removeSelf();
        sp.addChild(this.sp);
        this.sp.x -= sp.pivotX;
        this.sp.y -= sp.pivotY;
        this.imgTop.removeSelf();
        sp.addChild(this.imgTop);
        this.imgTop.x -= sp.pivotX;
        this.imgTop.y -= sp.pivotY;
    }
    /**回 */
    public getSelf(sp) : void
    {
        this.sp.removeSelf();
        this.sp.x += sp.pivotX;
        this.sp.y += sp.pivotY;
        this.view.addChild(this.sp);
        this.imgTop.removeSelf();
        this.imgTop.x += sp.pivotX;
        this.imgTop.y += sp.pivotY;
        this.view.addChild(this.imgTop);

    }




}