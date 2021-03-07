//modifies the in-game parameter HUD
sc.ParamHudGui.inject({ 
    init(){
        this.parent();
        this.hp = new sc.ParamHudGui.Param("maxhp", "hp", 66, 99999, 0);
        this.hp.setAlign(ig.GUI_ALIGN.X_LEFT, ig.GUI_ALIGN.Y_TOP);
        this.hp.setPos(52, 0);
        this.addChildGui(this.hp);
        this.atk = new sc.ParamHudGui.Param("atk", "attack", 58, 9999, 1);
        this.atk.setAlign(ig.GUI_ALIGN.X_LEFT, ig.GUI_ALIGN.Y_TOP);
        this.atk.setPos(104, 0);
        this.addChildGui(this.atk);
        this.def = new sc.ParamHudGui.Param("def", "defense", 58, 9999, 2);
        this.def.setAlign(ig.GUI_ALIGN.X_LEFT, ig.GUI_ALIGN.Y_TOP);
        this.def.setPos(148,0);
        this.addChildGui(this.def);
        this.foc = new sc.ParamHudGui.Param("foc", "focus", 58, 9999, 3);
        this.foc.setAlign(ig.GUI_ALIGN.X_LEFT, ig.GUI_ALIGN.Y_TOP);
        this.foc.setPos(192, 0);
        this.addChildGui(this.foc);
    },
})

//modifies the actual hud of the GUI.
sc.HpHudGui.inject({
    init(){
        this.parent();
        this.setSize(68, 16);
        this.removeChildGui(this.hpNumber); //removes the original HP number
        
        this.hpNumber = new sc.NumberGui(99999, {
            signed: true,
            transitionTime: 0.5
        });
        this.hpNumber.setPos(7, 1);
        this.addChildGui(this.hpNumber);
    }
})

//uncaps on the equipment menu
sc.EquipStatusContainer.inject({
    init(){
        this.parent();
        this.removeAllChildren();

        let a = new sc.MenuPanel(sc.MenuPanelType.TOP_RIGHT_EDGE);
        
        a.setSize(169, 121);
        a.setPivot(0, 0);

        this.addChildGui(a);

        let b = 5, c = sc.model.player.equipParams;
        this.baseParams.hp = this._createStatusDisplay(0, b, "maxhp", 0, 0, false, 99999, c.hp, void 0, a);
        b = b + 14;
        this.baseParams.atk = this._createStatusDisplay(0, b, "atk", 0, 1, false, 9999, c.attack, void 0, a);
        b = b + 14;
        this.baseParams.def = this._createStatusDisplay(0, b, "def", 0, 2, false, 9999, c.defense, void 0, a);
        b = b + 14;
        this.baseParams.foc = this._createStatusDisplay(0, b, "foc", 0, 3, false, 9999, c.focus, void 0, a);
        b = b + 16;
        this.baseParams.fire = this._createStatusDisplay(0, b, "res", 1, 4, true, 999, c.elemFactor[0], void 0, a);
        b = b + 14;
        this.baseParams.cold = this._createStatusDisplay(0, b, "res", 2, 5, true, 999, c.elemFactor[1], void 0, a);
        b = b + 14;
        this.baseParams.shock = this._createStatusDisplay(0, b, "res", 3, 6, true, 999, c.elemFactor[2], void 0, a);
        this.baseParams.wave = this._createStatusDisplay(0, b + 14, "res", 4, 7, true, 999, c.elemFactor[3], void 0, a);

        a = new sc.HeaderMenuPanel(ig.lang.get("sc.gui.menu.equip.modifiers"), sc.MenuPanelType.TOP_RIGHT_EDGE);
        a.setPos(0, 125);
        a.setPivot(0, 0);
        a.setSize(169, 139);
        this.addChildGui(a);
        this.modPanel = a;
        for (var e in sc.MODIFIERS) {
            b = sc.MODIFIERS[e];
            b = this._createStatusDisplay(0, 0, "modifier." + e, 5, b.icon, true, sc.MAX_MOD_VAL, 1, b.noPercent || false, a, e, b.order);
            b.doStateTransition("HIDDEN", true);
            this.allModifiers[e] = b
        }
    },
})

//uncaps stats on status > summary screen
sc.StatusViewMainParameters.inject({
    init(){
        this.parent();
        var a = 97;
        this.baseParams.hp = this.createStatusDisplay(0, a, "maxhp", 0, 0, false, 99999);
        a = a + 14;
        this.baseParams.atk = this.createStatusDisplay(0, a, "atk", 0, 1, false, 9999);
        a = a + 14;
        this.baseParams.def = this.createStatusDisplay(0, a, "def", 0, 2, false, 9999);
        a = a + 14;
        this.baseParams.foc = this.createStatusDisplay(0, a, "foc", 0, 3, false, 9999);
    }
})

//uncaps status screen
//to-do: that ^