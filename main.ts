namespace SpriteKind {
    export const blueBulletKind = SpriteKind.create()
    export const orangeBulletKind = SpriteKind.create()
}


namespace smoothPortals {

    
    // BUTTON ENUM
    

    export enum PortalButton {
        //% block="A"
        A = 0,

        //% block="B"
        B = 1,

        //% block="left"
        Left = 2,

        //% block="right"
        Right = 3,

        //% block="up"
        Up = 4,

        //% block="down"
        Down = 5
    }

    // INTERFACE
    interface Portal {
        sprite: Sprite
        nx: number
        ny: number
    }


    
    // VARIABLES
    

    let playerSprite: Sprite = null
    
    let bluePortal: Portal = null
    let orangePortal: Portal = null
    
    let selectedBlueButton = PortalButton.A
    let selectedOrangeButton = PortalButton.B
    
    let momentumOn = true
    let physicsOn = true
    
    let isTeleportingNow = false
    
    let teleportClock = 0
    
    let startX = 0
    let startY = 0
    
    let destinationX = 0
    let destinationY = 0
    
    let oldVX = 0
    let oldVY = 0
    
    let enterNX = 0
    let enterNY = 0
    
    let exitNX = 0
    let exitNY = 0
    
    let enterEvents: (() => void)[] = []
    let exitEvents: (() => void)[] = []

    const teleportDuration = 300
    const exitDistance = 20

    
    // PORTAL IMAGES
    

    const blueImage = img`
        . . . . 8 8 8 8 . . . .
        . . 8 9 9 9 9 9 9 8 . .
        . 8 9 9 9 9 9 9 9 9 8 .
        8 9 9 9 9 9 9 9 9 9 9 8
        8 9 9 9 9 9 9 9 9 9 9 8
        8 9 9 9 9 9 9 9 9 9 9 8
        8 9 9 9 9 9 9 9 9 9 9 8
        8 9 9 9 9 9 9 9 9 9 9 8
        8 9 9 9 9 9 9 9 9 9 9 8
        8 9 9 9 9 9 9 9 9 9 9 8
        . 8 9 9 9 9 9 9 9 9 8 .
        . . 8 9 9 9 9 9 9 8 . .
    `

    const orangeImage = img`
        . . . . 5 5 5 5 . . . .
        . . 5 4 4 4 4 4 4 5 . .
        . 5 4 4 4 4 4 4 4 4 5 .
        5 4 4 4 4 4 4 4 4 4 4 5
        5 4 4 4 4 4 4 4 4 4 4 5
        5 4 4 4 4 4 4 4 4 4 4 5
        5 4 4 4 4 4 4 4 4 4 4 5
        5 4 4 4 4 4 4 4 4 4 4 5
        5 4 4 4 4 4 4 4 4 4 4 5
        5 4 4 4 4 4 4 4 4 4 4 5
        . 5 4 4 4 4 4 4 4 4 5 .
        . . 5 4 4 4 4 4 4 5 . .
    `

    
    // SET PLAYER
    

    //% block="set portal player to %sprite"
    //% blockId=smoothPortals_setPlayer
    export function setPortalPlayer(sprite: Sprite): void {
        playerSprite = sprite
    }

    
    // BUTTON SETTINGS
    

    //% block="set blue portal button to %button"
    //% blockId=smoothPortals_blueButton
    export function chooseBlueButton(
        button: PortalButton
    ): void {
        selectedBlueButton = button
    }

    //% block="set orange portal button to %button"
    //% blockId=smoothPortals_orangeButton
    export function chooseOrangeButton(
        button: PortalButton
    ): void {
        selectedOrangeButton = button
    }

    
    // MOMENTUM
    

    //% block="set portal momentum to %enabled"
    //% blockId=smoothPortals_setMomentum
    export function enableMomentum(
        enabled: boolean
    ): void {
        momentumOn = enabled
    }

    //% block="portal momentum is enabled"
    //% blockId=smoothPortals_momentum
    export function getMomentum(): boolean {
        return momentumOn
    }

    
    // PHYSICS
    

    //% block="set portal physics to %enabled"
    //% blockId=smoothPortals_setPhysics
    export function enablePhysics(
        enabled: boolean
    ): void {
        physicsOn = enabled
    }

    
    // FIRE BLUE
    

    //% block="shoot blue portal"
    //% blockId=smoothPortals_shootBlue
    export function shootBluePortal(): void {

        if (!physicsOn)
            return

        if (!playerSprite)
            return

        shootPortal(true)
    }

    
    // FIRE ORANGE
    

    //% block="shoot orange portal"
    //% blockId=smoothPortals_shootOrange
    export function shootOrangePortal(): void {

        if (!physicsOn)
            return

        if (!playerSprite)
            return

        shootPortal(false)
    }

    
    // SHOOT PORTAL
    

    function shootPortal(isBlue: boolean): void {

        let dx = controller.dx()
        let dy = controller.dy()

        if (dx == 0 && dy == 0) {

            dx = playerSprite.vx
            dy = playerSprite.vy

            if (dx == 0 && dy == 0) {
                dy = -1
            }
        }

        let length =
            Math.sqrt(dx * dx + dy * dy)

        if (length == 0)
            return

        dx /= length
        dy /= length

        dx *= bulletSpeed
        dy *= bulletSpeed

        let bullet: Sprite

        if (isBlue) {

            bullet = sprites.createProjectileFromSprite(
                blueImage,
                playerSprite,
                dx,
                dy
            )

            bullet.setKind(blueBulletKind)

        } else {

            bullet = sprites.createProjectileFromSprite(
                orangeImage,
                playerSprite,
                dx,
                dy
            )

            bullet.setKind(orangeBulletKind)
        }

        bullet.lifespan = bulletLife
    }

    
    // BLUE BULLET
    

    game.onUpdate(function () {

        let bullets =
            sprites.allOfKind(blueBulletKind)

        for (let bullet2 of bullets) {

            checkBullet(bullet2, true)
        }
    })

    
    // ORANGE BULLET
    

    game.onUpdate(function () {

        let bullets2 =
            sprites.allOfKind(orangeBulletKind)

        for (let bullet3 of bullets2) {

            checkBullet(bullet3, false)
        }
    })

    
    // BULLET COLLISION
    

    function checkBullet(
        bullet: Sprite,
        isBlue: boolean
    ): void {

        if (!bullet)
            return

        let column =
            Math.floor(bullet.x / 16)

        let row =
            Math.floor(bullet.y / 16)

        if (column < 0 || row < 0)
            return

        let tile =
            tiles.getTileLocation(
                column,
                row
            )

        if (!tiles.tileAtLocationIsWall(tile))
            return

        let nx = 0
        let ny = 0

        if (Math.abs(bullet.vx) >
            Math.abs(bullet.vy)) {

            if (bullet.vx > 0)
                nx = -1
            else
                nx = 1

        } else {

            if (bullet.vy > 0)
                ny = -1
            else
                ny = 1
        }

        createPortal(
            isBlue,
            column * 16 + 8,
            row * 16 + 8,
            nx,
            ny
        )

        bullet.destroy()
    }

    
    // CREATE PORTAL
    

    function createPortal(
        isBlue: boolean,
        x: number,
        y: number,
        nx: number,
        ny: number
    ): void {
    
        const image = isBlue ? blueImage : orangeImage
    
        const portalSprite = sprites.create(
            image,
            SpriteKind.Food
        )
    
        portalSprite.setFlag(
            SpriteFlag.Ghost,
            true
        )
    
        portalSprite.setPosition(
            x,
            y
        )
    
        const portal: Portal = {
            sprite: portalSprite,
            nx: nx,
            ny: ny
        }
    
        if (isBlue) {
    
            if (bluePortal)
                bluePortal.sprite.destroy()
    
            bluePortal = portal
    
        } else {
    
            if (orangePortal)
                orangePortal.sprite.destroy()
    
            orangePortal = portal
        }
    }

    
    // TELEPORT CHECK
    

    game.onUpdate(function () {

        if (!physicsOn)
            return

        if (!playerSprite)
            return

        if (!bluePortal || !orangePortal) return;

        if (isTeleportingNow)
            return

        if (playerSprite.overlapsWith(
            bluePortal.sprite
        )) {
        
            beginPortalTeleport(
                bluePortal,
                orangePortal
            )
        
            return
        }

        if (playerSprite.overlapsWith(
            orangePortal.sprite
        )) {
        
            beginPortalTeleport(
                orangePortal,
                bluePortal
            )
        }
    })

    
    // BEGIN TELEPORT
    

    function beginPortalTeleport(
        entrance: Portal,
        exit: Portal
    ): void {

        if (isTeleportingNow)
            return

        isTeleportingNow = true
        teleportClock = 0

        startX = playerSprite.x
        startY = playerSprite.y

        oldVX = playerSprite.vx
        oldVY = playerSprite.vy

        enterNX = entranceNX
        enterNY = entranceNY

        exitNX = exitNX
        exitNY = exitNY

        destinationX =
            exit.x +
            exitNX * exitDistance

        destinationY =
            exit.y +
            exitNY * exitDistance

        for (let event of enterEvents) {
            event()
        }
    }

    
    // SMOOTH TELEPORT
    

    game.onUpdateInterval(
        10,
        function () {

            if (!isTeleportingNow)
                return

            if (!playerSprite)
                return

            teleportClock += 10

            let amount =
                teleportClock /
                teleportDuration

            if (amount > 1)
                amount = 1

            // Smoothstep interpolation.
            let smooth =
                amount *
                amount *
                (3 - 2 * amount)

            playerSprite.x =
                startX +
                (destinationX - startX) *
                smooth

            playerSprite.y =
                startY +
                (destinationY - startY) *
                smooth

            if (momentumOn) {

                playerSprite.vx = oldVX
                playerSprite.vy = oldVY
            }

            if (amount >= 1) {

                finishPortalTeleport()
            }
        }
    )

    
    // FINISH TELEPORT
    

    function finishPortalTeleport(): void {

        if (!playerSprite)
            return

        if (momentumOn) {

            applyMomentum(
                oldVX,
                oldVY,
                enterNX,
                enterNY,
                exitNX,
                exitNY
            )

        } else {

            playerSprite.vx = 0
            playerSprite.vy = 0
        }

        isTeleportingNow = false

        for (let event2 of exitEvents) {
            event2()
        }
    }

    
    // MOMENTUM
    

    function applyMomentum(
        vx: number,
        vy: number,
        inNX: number,
        inNY: number,
        outNX: number,
        outNY: number
    ): void {

        let inTX = -inNY
        let inTY = inNX

        let outTX = -outNY
        let outTY = outNX

        let tangent =
            vx * inTX +
            vy * inTY

        let normal =
            vx * inNX +
            vy * inNY

        let outgoingNormal =
            -normal

        playerSprite.vx =
            outTX * tangent +
            outNX * outgoingNormal

        playerSprite.vy =
            outTY * tangent +
            outNY * outgoingNormal
    }

    
    // ENTER EVENT
    

    //% block="on player enter portal"
    //% blockId=smoothPortals_enter
    export function whenPlayerEntersPortal(
        handler: () => void
    ): void {

        enterEvents.push(handler)
    }

    
    // EXIT EVENT
    

    //% block="on player exit portal"
    //% blockId=smoothPortals_exit
    export function whenPlayerExitsPortal(
        handler: () => void
    ): void {

        exitEvents.push(handler)
    }

    
    // STATUS
    

    //% block="blue portal exists"
    //% blockId=smoothPortals_blueExists
    export function hasBluePortal(): boolean {

        return bluePortal != null
    }

    //% block="orange portal exists"
    //% blockId=smoothPortals_orangeExists
    export function hasOrangePortal(): boolean {

        return orangePortal != null
    }

    //% block="both portals exist"
    //% blockId=smoothPortals_bothExist
    export function hasBothPortals(): boolean {

        return bluePortal != null && orangePortal != null
    }

    //% block="player is going through portal"
    //% blockId=smoothPortals_teleporting
    export function playerIsTeleporting(): boolean {

        return isTeleportingNow
    }

    
    // REMOVE BLUE
    

    //% block="remove blue portal"
    //% blockId=smoothPortals_removeBlue
    export function deleteBluePortal(): void {

        if (bluePortal) {

            bluePortal.sprite.destroy()
            bluePortal = null
        }
    }

    
    // REMOVE ORANGE
    

    //% block="remove orange portal"
    //% blockId=smoothPortals_removeOrange
    export function deleteOrangePortal(): void {

        if (orangePortal) {

            orangePortal.destroy()
            orangePortal = null
        }
    }

    
    // REMOVE BOTH
    

    //% block="remove both portals"
    //% blockId=smoothPortals_removeBoth
    export function deleteBothPortals(): void {

        deleteBluePortal()
        deleteOrangePortal()
    }

    
    // BUTTON A
    

    controller.A.onEvent(
        ControllerButtonEvent.Pressed,
        function () {

            if (selectedBlueButton ==
                PortalButton.A) {

                shootBluePortal()
            }

            if (selectedOrangeButton ==
                PortalButton.A) {

                shootOrangePortal()
            }
        }
    )

    
    // BUTTON B
    

    controller.B.onEvent(
        ControllerButtonEvent.Pressed,
        function () {

            if (selectedBlueButton ==
                PortalButton.B) {

                shootBluePortal()
            }

            if (selectedOrangeButton ==
                PortalButton.B) {

                shootOrangePortal()
            }
        }
    )

    
    // LEFT
    

    controller.left.onEvent(
        ControllerButtonEvent.Pressed,
        function () {

            if (selectedBlueButton ==
                PortalButton.Left) {

                shootBluePortal()
            }

            if (selectedOrangeButton ==
                PortalButton.Left) {

                shootOrangePortal()
            }
        }
    )

    
    // RIGHT
    

    controller.right.onEvent(
        ControllerButtonEvent.Pressed,
        function () {

            if (selectedBlueButton ==
                PortalButton.Right) {

                shootBluePortal()
            }

            if (selectedOrangeButton ==
                PortalButton.Right) {

                shootOrangePortal()
            }
        }
    )

    
    // UP
    

    controller.up.onEvent(
        ControllerButtonEvent.Pressed,
        function () {

            if (selectedBlueButton ==
                PortalButton.Up) {

                shootBluePortal()
            }

            if (selectedOrangeButton ==
                PortalButton.Up) {

                shootOrangePortal()
            }
        }
    )

    
    // DOWN
    

    controller.down.onEvent(
        ControllerButtonEvent.Pressed,
        function () {

            if (selectedBlueButton ==
                PortalButton.Down) {

                shootBluePortal()
            }

            if (selectedOrangeButton ==
                PortalButton.Down) {

                shootOrangePortal()
            }
        }
    )
}
