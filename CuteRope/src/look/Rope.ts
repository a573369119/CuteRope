    import RopePoint from "./RopePoint";
    export default class Rope{
    /**绳子节点数组 */
    public ropePointsArray:Array<RopePoint>;
    /**绳子关节数组 */
	public jointsArray:Array<Laya.RevoluteJoint>;
    constructor(count:number,hookX,HookY,CandyX,CandyY){
        this.ropePointsArray=new Array<RopePoint>();
        this.jointsArray=new Array<Laya.RevoluteJoint>();
        this.createMultiRopePoint(count,hookX,HookY,CandyX,CandyY);
        // Laya.timer.frameLoop(1,this,this.rotateRopePoint);
        
        // for(let i=1;i<this.ropePointsArray.length;i++){
        //     this.createJoint(this.ropePointsArray[i-1].body,this.ropePointsArray[i-1].anchor,this.ropePointsArray[i].body,this.ropePointsArray[i].anchor,this.ropePointsArray[i].rp);
        // }
    }

    createMultiRopePoint(count:number,hookX,hookY,candyX,candyY):void{
        //第一个节点与最后一个节点的距离
        let disTotal:number=Math.sqrt(Math.pow(hookX - candyX,2) + Math.pow(hookY - candyY,2));
        //每个节点间的距离
        let disPer:number=disTotal/(count-1);
        //每一个节点水平方向偏移量
        let x_Add=disPer*this.rotationDeal(hookX,hookY,candyX,candyY,"cos");
        //每一个节点竖直方向偏移量
        let y_Add=disPer*this.rotationDeal(hookX,hookY,candyX,candyY,"sin");
        if(disPer >= 60) {console.log("距离不够");}        
        for(let i=0;i<count;i++){
            let ropePoint;
            if(i==0){
                ropePoint=new RopePoint(hookX+x_Add*i,hookY+i*y_Add,"kinematic",this.ropePointsArray[i-1]);
                // ropePoint.rp.visible=false;
            }
            else
            {
                ropePoint=new RopePoint(hookX+x_Add*i,hookY+i*y_Add,"dynamic",this.ropePointsArray[i-1]);
            }
            this.ropePointsArray.push(ropePoint);
        }
    }
    // createJoint(body1,anchor1,body2,anchor2,rp):void{
        
    //         var joint=new Laya.RevoluteJoint();

    //             //joint.collideConnected=false;
    //             //joint.damping=0.1;
    //             //console.log(joint.frequency)
    //             //joint.frequency=30;              
    //             //joint.maxLength=6;
    //             rp.addComponentIntance(joint);
    //             this.jointsArray.push(joint);

    // }
    
    rotateRopePoint():void{
        for(let i=1;i<this.ropePointsArray.length;i++){
            let cos=this.rotationDeal(this.ropePointsArray[i-1].rp.x,this.ropePointsArray[i-1].rp.y,this.ropePointsArray[i].rp.x,this.ropePointsArray[i].rp.y,"cos");
            let sin=this.rotationDeal(this.ropePointsArray[i-1].rp.x,this.ropePointsArray[i-1].rp.y,this.ropePointsArray[i].rp.x,this.ropePointsArray[i].rp.y,"sin");
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
           this.ropePointsArray[i].rp.rotation=rotation;
           
        }
        
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
}

