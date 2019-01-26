import RopePoint from "./RopePoint";
import Candy from "./Candy";
import GameConfig from "../config/GameConfig";
import Tool from "../Tool/Tool";
import Dic from "../Tool/dic";
    
    export default class Rope{
    /**绳子节点数组 */
    public ropePointsArray:Array<RopePoint>;
    /**绳子关节数组 */
    public jointsArray:Array<Laya.RevoluteJoint>;
    /**绳子长度 */
    public count:number;
    /**所在界面 */
    public view : Laya.Panel;
    /**是否已断 */
    public isCuted : boolean ;
    /**sprite */
    public ropeView : Laya.Sprite;
    /**图片补充数组 */
    public arr_ImgRope : Array<Laya.Image>;
    /**数组保存 */
    public arr_RemPos : Array<any>;
    /**所属hook类型 */
    public hookStyle : string;

    constructor(view){
        this.isCuted = false;
        this.view = view;
        this.ropeView = new Laya.Sprite();

        //         // //测试
        // let img = new Laya.Sprite();
        // img.loadImage('gameView/gameBtn/regame.png');
        // img.pos(240,400);
        // let RigidBody = new Laya.RigidBody();
        // RigidBody.type = "kinematic";
        // // RigidBody.allowSleep = false;
		// RigidBody.allowRotation = true;
        // img.addComponentIntance(RigidBody);
        // this.ropeView.addChild(img);

        view.addChild(this.ropeView);
        this.arr_ImgRope = new Array<Laya.Image>();
        this.ropePointsArray=new Array<RopePoint>();
        this.jointsArray=new Array<Laya.RevoluteJoint>();
        this.arr_RemPos = new Array<any>();
    }

    //创建一根绳子，根据位置和长度创建
    init(hookX,HookY,ropeLength,hookStyle?):void{
        this.hookStyle = hookStyle;
        this.createMultiRopePoint(hookX,HookY,ropeLength,hookStyle);
    }
    //自动连接绳子
    initRopeHook2(hookX,hookY,candyX,candyY,hookStyle?) : void
    {
        this.hookStyle = hookStyle;
        this.createRopeHook2(hookX,hookY,candyX,candyY);
    }

    private createRopeHook2(hookX,hookY,candyX,candyY) : void
    {
        let dic = Dic.countDic_Object({"x":hookX,"y":hookY},{"x":candyX,"y":candyY});
        let count = Math.floor(dic / GameConfig.ROPE_DIC);
        let x_Add = GameConfig.ROPE_DIC*this.rotationDeal(hookX,hookY,candyX,candyY,"cos"); 
        let y_Add = GameConfig.ROPE_DIC*this.rotationDeal(hookX,hookY,candyX,candyY,"sin"); 
        for(let i=0;i<count+1;i++){
            let ropePoint : RopePoint ;
            
            if(i==0){
                ropePoint=new RopePoint(hookX+x_Add*i,hookY+i*y_Add,"kinematic",i,null,this.rotateRopePoint_2(hookX,hookY,candyX,candyY));
                // this.rotateRopePoint_2(ropePoint);
                ropePoint.addView(this.ropeView);
            }
            else
            {

                ropePoint =new RopePoint(hookX+x_Add*(i-1),hookY+(i-1)*y_Add,"dynamic",i,null,this.rotateRopePoint_2(hookX,hookY,candyX,candyY));
                //**添加Joint */
                ropePoint.ropePoint_AddJoint(this.ropePointsArray[i-1]);
                // this.rotateRopePoint_2(ropePoint);
                ropePoint.addView(this.ropeView);
            }
            if(ropePoint.sp.getComponent(Laya.RevoluteJoint))
            {
                this.jointsArray.push(ropePoint.sp.getComponent(Laya.RevoluteJoint));
            }
            this.ropePointsArray.push(ropePoint);
        }
        // this.rotateRopePoint();
    }
    /**记录位置 */
        private remPos(x,y,rotation) {
            let Pos : any;
            Pos = {};
            Pos.x = x;
            Pos.y = y;
            Pos.rotation = rotation;
            this.arr_RemPos.push(Pos);
        }

    // update(hookX,HookY,ropeLength):void{
    //     // this.init(hookX,HookY,ropeLength);
    // }

    createMultiRopePoint(hookX,hookY,ropeLength,hookStyle?):void{
        let ropeDic : number;
        if(hookStyle == "hook3")
        {   //弹力剩
            ropeDic = GameConfig.ROPE_JUMP_DIC;
        }
        else
        {
            ropeDic = GameConfig.ROPE_DIC;
        }
        //第一个节点与最后 一个节点的距离
        //创建多少个节点 30个像素一个间隔
        let disPer:number=ropeLength/ropeDic;
        //每一个节点水平方向偏移量
        let x_Add=ropeDic*this.rotationDeal(hookX,hookY,hookX,hookY + ropeLength,"cos");
        //每一个节点竖直方向偏移量
        let y_Add=ropeDic*this.rotationDeal(hookX,hookY,hookX,hookY + ropeLength,"sin");
        // if(disPer >= 60) {console.log("距离不够");}   
        for(let i=0;i<disPer+1;i++){
            let ropePoint : RopePoint ;
            if(i==0){
                ropePoint=new RopePoint(hookX+x_Add*i,hookY+i*y_Add,"kinematic",i,hookStyle);
                ropePoint.addView(this.ropeView);
            }
            else
            {
                ropePoint =new RopePoint(hookX+x_Add*(i-1),hookY+(i-1)*y_Add,"dynamic",i,hookStyle);
                ropePoint.ropePoint_AddJoint(this.ropePointsArray[i-1]);
                ropePoint.addView(this.ropeView);
                this.view.addChild(ropePoint.sp);
            }
            if(ropePoint.sp.getComponent(Laya.RevoluteJoint))
            {
                this.jointsArray.push(ropePoint.sp.getComponent(Laya.RevoluteJoint));
            }
            this.ropePointsArray.push(ropePoint);
        }
        // console.log(this.jointsArray);
        // console.log(this.ropePointsArray);
        // Laya.timer.loop(16,this,this.followPoint);
        
    }

    rotateRopePoint():void{
        for(let i=1;i<this.ropePointsArray.length;i++){
            let cos=this.rotationDeal(this.ropePointsArray[i-1].sp.x,this.ropePointsArray[i-1].sp.y,this.ropePointsArray[i].sp.x,this.ropePointsArray[i].sp.y,"cos");
            let sin=this.rotationDeal(this.ropePointsArray[i-1].sp.x,this.ropePointsArray[i-1].sp.y,this.ropePointsArray[i].sp.x,this.ropePointsArray[i].sp.y,"sin");
            let rotation;
            if(cos>=0&&sin>0){
                rotation= 180/Math.PI*Math.acos(cos)-90;
            }else if(cos<0&&sin>=0){
                rotation=180/Math.PI*Math.acos(cos)-90;
            }else if(cos<=0&&sin<0){
                rotation=90-180/Math.PI*Math.acos(cos);               
            }else if(cos>0&&sin<=0){
                rotation= 90-180/Math.PI*Math.acos(cos);
            }
        this.ropePointsArray[i].sp.rotation=rotation;
        
        }
        
    }
    /**重开 */
    public rePlay(arr_rem,style) : void
    {
        // if(disPer >= 60) {console.log("距离不够");}   
             
        for(let i=0;i<arr_rem.length;i++){
            let ropePoint : RopePoint;
            if(i==0){
                ropePoint=new RopePoint(arr_rem[i].x,arr_rem[i].y,"kinematic",i,style,arr_rem[i].rotation);
                ropePoint.addView(this.ropeView);
            }
            else
            {
                ropePoint =new RopePoint(arr_rem[i].x,arr_rem[i].y,"dynamic",i,style,arr_rem[i].rotation);
                ropePoint.ropePoint_AddJoint(this.ropePointsArray[i-1]);
                ropePoint.addView(this.ropeView);
            }
            if(ropePoint.sp.getComponent(Laya.RevoluteJoint))
            {
                this.jointsArray.push(ropePoint.sp.getComponent(Laya.RevoluteJoint));
            }
            this.ropePointsArray.push(ropePoint);
        }
    }

    public getRemRope() : any
    {
        let x;
        let y;
        let rotation;
        for(let i = 0; i<this.ropePointsArray.length ; i++)
        {
            x = this.ropePointsArray[i].sp.x;
            y = this.ropePointsArray[i].sp.y;
            rotation = this.ropePointsArray[i].sp.rotation;
            this.remPos(x,y,rotation);
        }
        return this.arr_RemPos;
    }

    private rotateRopePoint_2(x,y,X,Y):number
    {
            let cos=this.rotationDeal(x,y,X,Y,"cos");
            let sin=this.rotationDeal(x,y,X,Y,"sin");
            let rotation;
            if(cos>=0&&sin>0){
                rotation= 180/Math.PI*Math.acos(cos)-90;
            }else if(cos<0&&sin>=0){
                rotation=180/Math.PI*Math.acos(cos)-90;
            }else if(cos<=0&&sin<0){
                rotation=90-180/Math.PI*Math.acos(cos);               
            }else if(cos>0&&sin<=0){
                rotation= 90-180/Math.PI*Math.acos(cos);
            }
            return rotation;
    }

    /**连接糖果 */
    public connectCandy(candy : Candy,index:number) : void
    {
        let ropePoint : RopePoint = this.ropePointsArray[this.ropePointsArray.length-1];
        let joint = new Laya.RevoluteJoint();
        joint.otherBody = ropePoint.sp.getComponent(Laya.RigidBody);
        if(index == -1)
        {
            candy.createBody();
            index = candy.arr_Sp.length - 1;
        }
        joint.selfBody = candy.getCandyBody(index);
        // if(!joint.selfBody)
        // {
        //     joint.selfBody = candy.getCandyBody(index);
        // }
        joint.anchor = [candy.getCandySprite(index).width/2,candy.getCandySprite(index).height/2];
        candy.getCandySprite(index).addComponentIntance(joint);

        // console.log("-------------------");
        // console.log("maxlen::" + (this.ropePointsArray.length-1)*6);
        // console.log("ropePont::" + this.ropePointsArray.length);
        // console.log("spHeight::" + this.ropePointsArray[0].sp.height);
        //测试
        if(this.hookStyle == "hook3")
        {
            this.ropePointsArray[0].ropeJoint_Last(candy,(this.ropePointsArray.length-3)*(GameConfig.ROPE_DIC)/2.2);
            return;
        }
        this.ropePointsArray[0].ropeJoint_Last(candy,(this.ropePointsArray.length-3)*(GameConfig.ROPE_DIC+3));
        
    }
    
    /**角度处理函数
     * 
     *  传入 fx,fy,sx,sy
     * 
     *  获取正选 或余弦  或正切
     * 
     *  返回 对应值
     * 
     *  sin  对边/斜边
     *  cos  临边/斜边
     *  tan  对边/临边
     * 
     *  方向注释
     *  以f为中心，
     *  获取 与s连线和水平线正方向的夹角的 
     *      cos
     *      sin
     *  
     * */
    public rotationDeal(fx:number,fy:number,sx:number,sy:number,getString) : number
    {
        /**斜边 */
        let c : number = Math.sqrt(Math.pow(fx - sx,2) + Math.pow(fy - sy,2));
        /**临边 */
        let a : number = sx - fx;
        /**对边 */
        let b : number = sy - fy;
        
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

    /**绳子断掉 */
    public ropeCuted() : void
    {
        this.isCuted = true;
        this.ropePointsArray.forEach(point => {
            point.sp.getComponents(Laya.BoxCollider)[0].density = 1;
        });
        
        Laya.timer.loop(16,this,this.pointDestroy)
    }

    /**渐变 */
    public pointDestroy() : void
    {
        this.ropePointsArray.forEach(point => {
            point.sp.alpha -=0.01;
        });
        if(this.ropePointsArray[0].sp.alpha <= 0)
        {
            this.ropePointsArray.forEach(RopePoint => {
                RopePoint.sp.getComponents(Laya.RigidBody)[0].destroy();//对断掉的绳子进行优化
            });
            Laya.timer.clear(this,this.pointDestroy);
        }
    }

    public clearTimer() : void
    {
        Laya.timer.clear(this,this.pointDestroy);      
        this.ropePointsArray.forEach(point => {
            point.sp.removeSelf();
            let body = point.sp.getComponents(Laya.RigidBody);
            let joint = point.sp.getComponents(Laya.RevoluteJoint);
            let colider = point.sp.getComponents(Laya.BoxCollider);
            if(body && body[0])
            {
                body[0].destroy();
            }
            if(joint && joint[0])
            {
                joint[0].destroy();
            }
        });  
        this.ropePointsArray = [];
        this.jointsArray = [];
        this.isCuted = false;

    }
    // /**跟随节点*/
    // public followPoint() : void 
    // {
    //     let nextPoint : RopePoint;
    //     let lastPoint : RopePoint;
    //     let index;
    //     let dic;
    //     for(let i=0;i<this.arr_ImgRope.length;i++)
    //     {
    //         index = i+1;
    //         lastPoint = this.ropePointsArray[index];
    //         nextPoint = this.ropePointsArray[index+1];
    //         dic = Dic.countDic_Object(lastPoint.sp,nextPoint.sp);
    //         this.arr_ImgRope[i].x = 0 + dic*this.rotationDeal(lastPoint.sp.x,lastPoint.y,nextPoint.x,nextPoint.y,"cos");
    //         this.arr_ImgRope[i].y = 0 + dic*this.rotationDeal(lastPoint.sp.x,lastPoint.y,nextPoint.x,nextPoint.y,"sin");
    //     }
    // }
     /**绳子同步移动 */
     public moveTogether() : void
     {
         this.ropePointsArray.forEach(RopePoint => {
             RopePoint.sp.x += 0;
             RopePoint.sp.y += 0;
         });
     }
}

