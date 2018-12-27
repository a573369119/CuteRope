    import RopePoint from "./RopePoint";
import Candy from "./Candy";
import GameConfig from "../config/GameConfig";
    
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
    constructor(view){
        this.isCuted = false;
        this.view = view;
        this.ropePointsArray=new Array<RopePoint>();
        this.jointsArray=new Array<Laya.RevoluteJoint>();
    }

    //创建一根绳子，根据位置和长度创建
    init(hookX,HookY,ropeLength):void{
        this.createMultiRopePoint(hookX,HookY,ropeLength);
    }

    update(hookX,HookY,ropeLength):void{
        this.init(hookX,HookY,ropeLength);
    }
    createMultiRopePoint(hookX,hookY,ropeLength):void{
        //第一个节点与最后一个节点的距离
        //创建多少个节点 30个像素一个间隔
        let disPer:number=ropeLength/GameConfig.ROPE_DIC;
        //每一个节点水平方向偏移量
        let x_Add=30*this.rotationDeal(hookX,hookY,hookX,hookY + ropeLength,"cos");
        //每一个节点竖直方向偏移量
        let y_Add=30*this.rotationDeal(hookX,hookY,hookX,hookY + ropeLength,"sin");
        // if(disPer >= 60) {console.log("距离不够");}        
        for(let i=0;i<disPer;i++){
            let ropePoint : RopePoint ;
            if(i==0){
                ropePoint=new RopePoint(hookX+x_Add*i,hookY+i*y_Add,"kinematic");
                ropePoint.addView(this.view);
            }
            else
            {
                ropePoint =new RopePoint(hookX+x_Add*i,hookY+i*y_Add,"dynamic");
                ropePoint.ropePoint_AddJoint(this.ropePointsArray[i-1]);
                ropePoint.addView(this.view);
            }
            if(ropePoint.sp.getComponent(Laya.RevoluteJoint))
            {
                this.jointsArray.push(ropePoint.sp.getComponent(Laya.RevoluteJoint));
            }
            this.ropePointsArray.push(ropePoint);
        }
        console.log(this.jointsArray);
        console.log(this.ropePointsArray);
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

    /**连接糖果 */
    public connectCandy(candy : Candy,index:number) : void
    {
        let ropePoint : RopePoint = this.ropePointsArray[this.ropePointsArray.length-1];
        let joint = new Laya.RevoluteJoint();
        joint.otherBody = ropePoint.sp.getComponent(Laya.RigidBody);
        joint.selfBody = candy.getCandyBody(index);
        joint.anchor = [candy.getCandySprite(index).width/2,candy.getCandySprite(index).height/2];
        candy.getCandySprite(index).addComponentIntance(joint);
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
}

