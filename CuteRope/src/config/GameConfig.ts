/**
 * 游戏配置 属性设置
 * */
export default class GameConfig{
    /////////////////////////////////绳子
    /**绳子生成像素间隔 */
    public static ROPE_DIC : number = 30;
    /**绳子节点转动阻力 */
    public static ROPE_POINT_ANGULARDAMPING : number = 80;
    /**绳子线性阻力 */
    public static ROPE_POINT_LINEARDAMOING : number = 0.04;
    /**绳子密度 */
    public static ROPE_POINT_DENSITY : number = 50;
    /**绳子自动靠近糖果速度 */
    public static ROPE_TO_CANDY_SPEED : number = 12;
    ///////////////////////////////糖果
    /**糖果转动阻力 */
    public static CANDY_ANGULARDAMPING : number = 8;
    /**糖果线性转动阻力 */
    public static CANDY_LINEARDAMPING : number = 0.03;
    /**糖果密度 */
    public static CANDY_DENSITY : number = 50;
    /////////////////////////////////怪物
    /**吃糖果距离 */
    public static MONSTER_EAT_DIC : number = 50;
    /**张大嘴距离 */
    public static MONSTER_OPEN_MOUSE : number = 200;
    //////////////////////////////////////
    /**[monster]糖果丢失， 伤心 15*/
    public static ANI_MONSTER_SAD : string = "no"; 
    /**[monster]糖果吃到，咀嚼 9 LOOP*/
    public static ANI_MONSTER_EAT : string = "eat";
    /**[monster]吃到星星，开心 19*/
    public static ANI_MONSTER_HAPPYE : string = "getStar";
    /**[monster]糖果靠近 张嘴 13*/
    public static ANI_MONSTER_OPEN : string = "open";
    /**[monster]动作 给我吃 26*/
    public static ANI_MONSTER_GIVE_ME : string = "giveMe";
    /**[monster]动作 随机 29*/
    public static ANI_MONSTER_GIVE_ME2 : string = "giveMe2_";
    /**[monster]站立 不动 17*/
    public static ANI_MONSTER_STAND : string = "stand";
    /**[monster]动作 翘脚 43*/
    public static ANI_MONSTER_ACTION : string = "ation";
}
