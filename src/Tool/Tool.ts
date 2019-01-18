export default class Tool{
    //获取三角函数值
    public static rotationDeal(fx:number,fy:number,sx:number,sy:number,getString) : number
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

    /**碰撞检测 dicNum ：预设距离 object1和object2传入sprite,是按照每个sprite的锚点在中心位置来计算的  */
    public static collisionCheck(object1,object2) : boolean
    {
        if(Math.abs(object1.x - object2.x)< object1.width/2 + object2.width/2&&
           Math.abs(object1.y - object2.y) < object1.height/2 + object2.height/2){
               console.log("true");
            return true;
        }
        else{
            console.log("false");
            
            return false;
        }                
    }

    public static rotateRopePoint_2(x,y,X,Y):number
    {
            let cos=Tool.rotationDeal(x,y,X,Y,"cos");
            let sin=Tool.rotationDeal(x,y,X,Y,"sin");
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
}