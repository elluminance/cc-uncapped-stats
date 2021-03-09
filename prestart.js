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

//uncaps the HP bar
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
        
        //these little block here fixes so much more than it should tbh
        a.hook.transitions = {
            DEFAULT: {
                state: {},
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            },
            HIDDEN: {
                state: {
                    alpha: 0,
                    scaleY: 0
                },
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            }
        };
        this.statusPanel = a;

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
        this._setCurrentModifiers();
        a = new ig.ColorGui("#7E7E7E", 169, 1);
        a.setPos(0, 247);
        this.addChildGui(a);
        a = new ig.ImageGui(this.gfx, 528, 224, 13, 8);
        a.setPos(3, 252);
        this.addChildGui(a);
        this.arrow = a;
        a = new ig.ImageGui(this.gfx, 528, 224, 13, 8);
        a.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP);
        a.setPos(3, 252);
        this.addChildGui(a);
        this.arrow2 = a;
        a = new ig.ColorGui("#2C2D2D", 169, 1);
        a.setPos(0, 264);
        this.addChildGui(a);
        this.addChildGui(this.modMore);
        this.doStateTransition("HIDDEN", true)
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

//uncaps status > parameters
sc.StatusParamBar.inject({
    init(a, b, c, e, f, g, h, i, j){
        this.parent();
        this.removeAllChildren();
        this.setSize(Math.max(c || 169, 169), 24);
        this.name = a || "nope.";
        this.lineID = e || 0;
        this.iconID = f || 0;
        this.usePercent = g || false;
        this._skillHidden = h || false;
        this._noPercent = i || false;
        this.iconIndex.x = this.iconID % sc.MODIFIER_ICON_DRAW.MAX_PER_ROW;
        this.iconIndex.y = Math.floor(this.iconID / sc.MODIFIER_ICON_DRAW.MAX_PER_ROW);
        this.nameGui = new sc.TextGui(a, {
            font: sc.fontsystem.tinyFont
        });
        this.nameGui.setPos(13, 3);
        this.addChildGui(this.nameGui);
        a = this.usePercent ? 999 : 99999;
        j && (a = 9999);
        this.base = new sc.NumberGui(a, {
            signed: this.usePercent,
            transitionTime: 0.2
        });
        this.base.setPos(83 - ((this.usePercent || j) ? 8 : 4), 3);
        this.base.setNumber(0, true);
        this.guis.push(this.base);
        this.addTransitions(this.base);
        this.addChildGui(this.base);
        if (j) this.base.hook.pos.x = this.base.hook.pos.x + 8;
        this.equip = new sc.NumberGui(a, {
            signed: this.usePercent,
            transitionTime: 0.2
        });
        this.equip.setPos(127 - ((this.usePercent || j) ? 8 : 4), 3);
        this.equip.setNumber(0, true);
        this.guis.push(this.equip);
        this.addTransitions(this.equip);
        this.addChildGui(this.equip);
        if (j) this.equip.hook.pos.x = this.equip.hook.pos.x + 8;
        this.equipAdd = new sc.NumberGui(a, {
            signed: this.usePercent,
            transitionTime: 0.2,
            color: sc.GUI_NUMBER_COLOR.GREY
        });
        this.equipAdd.showPlus = true;
        this.equipAdd.showPlusOnZero = true;
        this.equipAdd.setPos(127 - ((this.usePercent || j) ? 8 : 4), 13);
        this.addTransitions(this.equipAdd);
        this.guis.push(this.equipAdd);
        this.equipAdd.doStateTransition("HIDDEN", true);
        this.addChildGui(this.equipAdd);
        if (j) this.equipAdd.hook.pos.x = this.equipAdd.hook.pos.x + 8;
        this.skills = new sc.NumberGui(a, {
            signed: this.usePercent,
            transitionTime: 0.2
        });
        this.skills.setPos(171 - ((this.usePercent || j) ? 8 : 4), 3);
        this.skills.setNumber(0, true);
        this.guis.push(this.skills);
        this.addTransitions(this.skills);
        this.addChildGui(this.skills);
        if (j) this.skills.hook.pos.x = this.skills.hook.pos.x + 8;
        h && this.skills.doStateTransition("HIDDEN", true);
        this.skillAdd = new sc.NumberGui(a, {
            signed: this.usePercent,
            transitionTime: 0.2,
            color: sc.GUI_NUMBER_COLOR.GREY
        });
        this.skillAdd.showPlus = true;
        this.skillAdd.showPlusOnZero = true;
        this.skillAdd.setPos(171 - ((this.usePercent || j) ? 8 : 4), 13);
        this.skillAdd.setNumber(0, true);
        this.addTransitions(this.skillAdd);
        this.guis.push(this.skillAdd);
        this.skillAdd.doStateTransition("HIDDEN", true);
        this.addChildGui(this.skillAdd);
        if (j) this.skillAdd.hook.pos.x = this.skillAdd.hook.pos.x + 8;
        j = new ig.ImageGui(this.gfx, 6, 321, 4, 6);
        j.setPos(119, 4);
        this.guis.push(j);
        this.addTransitions(j);
        this.addChildGui(j);
        j = new ig.ImageGui(this.gfx, 6, 321, 4, 6);
        j.setPos(163, 4);
        this.guis.push(j);
        this.addTransitions(j);
        this.addChildGui(j);
        h && j.doStateTransition("HIDDEN", true);
        this.description = new sc.TextGui(b, {
            font: sc.fontsystem.smallFont,
            maxWidth: 294 + (this._skillHidden ? 44 : 0),
            linePadding: -3
        });
        this.description.setPos(214 - (this._skillHidden ? 44 : 0), 0);
        this.addChildGui(this.description)
    }
})

//uncaps on trade/shop screen
sc.TradeToggleStats.inject({
    _createContent(){
        this.parent();
        this.removeAllChildren();

        this.addChildGui(this.compareText);
        this.addChildGui(this.compareHelpText);
        this.addChildGui(this.compareItem);
        let d = new sc.TextGui(ig.lang.get("sc.gui.trade.stats"), {font: sc.fontsystem.tinyFont});
        d.setPos(this.titleOffset, 31);
        this.addChildGui(d);

        let a = 41, 
            b = this.lineOffset;
        d = sc.model.player.equipParams;
        this.baseParams.hp = this._createStatusDisplay(b, a, "maxhp", 0, 0, false, 99999, d.hp);
        a = a + 14;
        this.baseParams.atk = this._createStatusDisplay(b, a, "atk", 0, 1, false, 9999, d.attack);
        a = a + 14;
        this.baseParams.def = this._createStatusDisplay(b, a, "def", 0, 2, false, 9999, d.defense);
        a = a + 14;
        this.baseParams.foc = this._createStatusDisplay(b, a, "foc", 0, 3, false, 9999, d.focus);
        a = a + 16;
        this.baseParams.fire = this._createStatusDisplay(b, a, "res", 1, 4, true, 999, d.elemFactor[0], 0);
        a = a + 14;
        this.baseParams.cold = this._createStatusDisplay(b, a, "res", 2, 5, true, 999, d.elemFactor[1], 1);
        a = a + 14;
        this.baseParams.shock = this._createStatusDisplay(b, a, "res", 3, 6, true, 999, d.elemFactor[2], 2);
        a = a + 14;
        this.baseParams.wave = this._createStatusDisplay(b, a, "res", 4, 7, true, 999, d.elemFactor[3], 3);
        a = a + 14;

        d = new sc.TextGui(ig.lang.get("sc.gui.trade.modifier"), {
            font: sc.fontsystem.tinyFont
        });
        d.setPos(this.titleOffset, a);
        this.addChildGui(d);
        for (var c in sc.MODIFIERS) {
            b = sc.MODIFIERS[c];
            b = this._createStatusDisplay(this.lineOffset, 0, "modifier." + c, 5, b.icon, true, sc.MAX_MOD_VAL, 1, void 0, b.noPercent || false, c, b.order);
            b.doStateTransition("HIDDEN", true);
            this.modifierPool[c] = b
        }
    }
})