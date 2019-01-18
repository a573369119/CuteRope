import {ui} from "../ui/layaMaxUI";

/**
 * shopdilog
 */
export default class ShopDialog extends ui.Shop.ShopDialogUI{

    constructor(){
        super();
        this.init();
    }
    
    private init() : void
    {

        this.btn_close.on(Laya.Event.CLICK,this,this.onClose);
        this.btn_shop1.on(Laya.Event.CLICK,this,this.showShop,[1]);
        this.btn_shop2.on(Laya.Event.CLICK,this,this.showShop,[2]);

        this.btn_close.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDow);
        this.btn_close.on(Laya.Event.MOUSE_OUT,this,this.onMouseOut);        
        // this.film.on(Laya.Event.CLICK)
    }

    private onMouseDow() : void
    {
        this.btn_close.skin =  "shop/2 (13).png";
    }

    private onMouseOut() : void
    {
        this.btn_close.skin = "shop/2 (12).png";
    }

    private onClose() : void
    {
        this.close();
    }

    private showShop(index) : void
    {
        let shopTopSkin = "shop/shop1Top.png";
        let shopskinMian = "shop/shop1Main.png";
        let shopBottom = "shop/2 (15).png";
        this.btn_close.skin = "shop/2 (12).png";
        let shopContent = true;
        if(index==2)
        {
            shopContent = false;
            shopTopSkin = "shop/shop2Top.png";
            shopskinMian = "shop/shop2main.png";
            shopBottom = "shop/2 (5).png";
            
        }
        this.shop1.visible = shopContent;
        this.shop2.visible = !shopContent;
        this.shopskinTop.skin = shopTopSkin;
        this.imgBottom.skin = shopBottom;
        this.shopskinMain.skin = shopskinMian;
    }

    public set(lookShop,gameView?) : void
    {
        if(gameView)
        {
            //检查道具
            if(true)
            {
                return;
            }
        }
        this.showShop(lookShop);
        this.popup();
    }
}