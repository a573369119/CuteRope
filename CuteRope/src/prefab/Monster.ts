export default class Monster{
    /**横坐标 */
    public monster_X : number;
    /**纵坐标 */
    public monster_Y : number;
    /**吃到糖果宽度 */
    public eatWidth:number;
    /**吃到糖果高度 */
    public eatHeight:number;
    /**张嘴宽度 */
    public openWidth:number;
    /**张嘴高度 */ 
    public openHeight:number;
    constructor(){
        this.eatWidth=84;
        this.eatHeight=84;
        this.openWidth=200;
        this.openHeight=200;
    }

    init(data):void{
        this.monster_X=data.monster_X;
        this.monster_Y=data.monster_Y;      
    }

    update(data):void{
        this.monster_X=data.monster_X;
        this.monster_Y=data.monster_Y;
        
    }


    
}