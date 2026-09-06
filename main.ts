namespace portalPhysics {

    // ============================================================
    // SETTINGS
    // ============================================================

    export enum PortalButton {
        A = 0,
        B = 1,
        Left = 2,
        Right = 3,
        Up = 4,
        Down = 5
    }

    let player: Sprite = null

    let bluePortal: Sprite = null
    let orangePortal: Sprite = null

    let portalSurfaceTile: Image = null

    let bluePortalUp: Image = null
    let bluePortalDown: Image = null
    let bluePortalLeft: Image = null
    let bluePortalRight: Image = null

    let orangePortalUp: Image = null
    let orangePortalDown: Image = null
    let orangePortalLeft: Image = null
    let orangePortalRight: Image = null

    let blueProjectileImage: Image = null
    let orangeProjectileImage: Image = null

    let blueButton = PortalButton.A
    let orangeButton = PortalButton.B

    let portalSpeed = 150
    let teleportTime = 300
    let teleportCooldown = 350

    let blueNormalX = 0
    let blueNormalY = -1

    let orangeNormalX = 0
    let orangeNormalY = -1

    let teleporting = false
    let lastTeleportTime = 0

    const blueProjectileKind = SpriteKind.create()
    const orangeProjectileKind = SpriteKind.create()
    const portalKind = SpriteKind.create()


    // ============================================================
    // PLAYER
    // ============================================================

    //% block="set portal player $sprite"
    //% sprite.shadow=variables_get
    export function setPortalPlayer(sprite: Sprite) {
        player = sprite
    }


    // ============================================================
    // PORTAL SURFACE
    // ============================================================

    //% block="set portal surface tile $tile"
    //% tile.shadow=tileset_tile_picker
    export function setPortalSurfaceTile(tile: Image) {
        portalSurfaceTile = tile
    }


    // ============================================================
    // BLUE PORTAL ART
    // ============================================================

    //% block="set blue portal up image $image"
    //% imageLiteral=1
    export function setBluePortalUpImage(image: Image) {
        bluePortalUp = image
    }

    //% block="set blue portal down image $image"
    //% imageLiteral=1
    export function setBluePortalDownImage(image: Image) {
        bluePortalDown = image
    }

    //% block="set blue portal left image $image"
    //% imageLiteral=1
    export function setBluePortalLeftImage(image: Image) {
        bluePortalLeft = image
    }

    //% block="set blue portal right image $image"
    //% imageLiteral=1
    export function setBluePortalRightImage(image: Image) {
        bluePortalRight = image
    }


    // ============================================================
    // ORANGE PORTAL ART
    // ============================================================

    //% block="set orange portal up image $image"
    //% imageLiteral=1
    export function setOrangePortalUpImage(image: Image) {
        orangePortalUp = image
    }

    //% block="set orange portal down image $image"
    //% imageLiteral=1
    export function setOrangePortalDownImage(image: Image) {
        orangePortalDown = image
    }

    //% block="set orange portal left image $image"
    //% imageLiteral=1
    export function setOrangePortalLeftImage(image: Image) {
        orangePortalLeft = image
    }

    //% block="set orange portal right image $image"
    //% imageLiteral=1
    export function setOrangePortalRightImage(image: Image) {
        orangePortalRight = image
    }


    // ============================================================
    // PROJECTILE ART
    // ============================================================

    //% block="set blue portal projectile image $image"
    //% imageLiteral=1
    export function setBlueProjectileImage(image: Image) {
        blueProjectileImage = image
    }

    //% block="set orange portal projectile image $image"
    //% imageLiteral=1
    export function setOrangeProjectileImage(image: Image) {
        orangeProjectileImage = image
    }


    // ============================================================
    // BUTTON SETTINGS
    // ============================================================

    //% block="blue portal button $button"
    export function setBluePortalButton(button: PortalButton) {
        blueButton = button
    }

    //% block="orange portal button $button"
    export function setOrangePortalButton(button: PortalButton) {
        orangeButton = button
    }


    // ============================================================
    // PHYSICS SETTINGS
    // ============================================================

    //% block="portal projectile speed $speed"
    //% speed.min=20 speed.max=300
    export function setPortalProjectileSpeed(speed: number) {
        portalSpeed = speed
    }

    //% block="portal teleport time $time ms"
    //% time.min=50 time.max=1000
    export function setPortalTeleportTime(time: number) {
        teleportTime = time
    }

    //% block="portal teleport cooldown $time ms"
    //% time.min=0 time.max=2000
    export function setPortalTeleportCooldown(time: number) {
        teleportCooldown = time
    }


    // ============================================================
    // IMAGE HELPERS
    // ============================================================

    function getBluePortalImage(): Image {
        if (blueNormalX < 0) {
            if (bluePortalLeft != null) {
                return bluePortalLeft
            }
        }

        if (blueNormalX > 0) {
            if (bluePortalRight != null) {
                return bluePortalRight
            }
        }

        if (blueNormalY < 0) {
            if (bluePortalUp != null) {
                return bluePortalUp
            }
        }

        if (blueNormalY > 0) {
            if (bluePortalDown != null) {
                return bluePortalDown
            }
        }

        return image.create(1, 1)
    }


    function getOrangePortalImage(): Image {
        if (orangeNormalX < 0) {
            if (orangePortalLeft != null) {
                return orangePortalLeft
            }
        }

        if (orangeNormalX > 0) {
            if (orangePortalRight != null) {
                return orangePortalRight
            }
        }

        if (orangeNormalY < 0) {
            if (orangePortalUp != null) {
                return orangePortalUp
            }
        }

        if (orangeNormalY > 0) {
            if (orangePortalDown != null) {
                return orangePortalDown
            }
        }

        return image.create(1, 1)
    }


    // ============================================================
    // PROJECTILE CREATION
    // ============================================================

    function createPortalProjectile(isBlue: boolean) {
        if (player == null) {
            return
        }

        let imageToUse: Image

        if (isBlue) {
            imageToUse = blueProjectileImage
        } else {
            imageToUse = orangeProjectileImage
        }

        if (imageToUse == null) {
            imageToUse = image.create(3, 3)
        }

        let dx = controller.dx()
        let dy = controller.dy()

        // If the controller isn't currently pointing,
        // use the player's velocity.
        if (dx == 0 && dy == 0) {
            dx = player.vx
            dy = player.vy
        }

        // Default direction: up
        if (dx == 0 && dy == 0) {
            dy = -1
        }

        let projectile = sprites.createProjectileFromSprite(
            imageToUse,
            player,
            dx,
            dy
        )

        if (isBlue) {
            projectile.setKind(blueProjectileKind)
        } else {
            projectile.setKind(orangeProjectileKind)
        }

        projectile.setFlag(SpriteFlag.GhostThroughWalls, true)
        projectile.lifespan = 5000

        // Normalize the velocity so speed is consistent
        let length = Math.sqrt(
            projectile.vx * projectile.vx +
            projectile.vy * projectile.vy
        )

        if (length > 0) {
            projectile.vx = projectile.vx / length * portalSpeed
            projectile.vy = projectile.vy / length * portalSpeed
        }
    }


    // ============================================================
    // MANUAL SHOOT BLOCKS
    // ============================================================

    //% block="shoot blue portal"
    export function shootBluePortal() {
        createPortalProjectile(true)
    }

    //% block="shoot orange portal"
    export function shootOrangePortal() {
        createPortalProjectile(false)
    }


    // ============================================================
    // PORTAL PLACEMENT
    // ============================================================

    function placeBluePortal(col: number, row: number, nx: number, ny: number) {
        if (bluePortal != null) {
            bluePortal.destroy()
        }

        blueNormalX = nx
        blueNormalY = ny

        bluePortal = sprites.create(
            getBluePortalImage(),
            portalKind
        )

        bluePortal.x = col * 16 + 8
        bluePortal.y = row * 16 + 8

        bluePortal.setFlag(SpriteFlag.Ghost, true)
        bluePortal.setFlag(SpriteFlag.GhostThroughWalls, true)
    }


    function placeOrangePortal(col: number, row: number, nx: number, ny: number) {
        if (orangePortal != null) {
            orangePortal.destroy()
        }

        orangeNormalX = nx
        orangeNormalY = ny

        orangePortal = sprites.create(
            getOrangePortalImage(),
            portalKind
        )

        orangePortal.x = col * 16 + 8
        orangePortal.y = row * 16 + 8

        orangePortal.setFlag(SpriteFlag.Ghost, true)
        orangePortal.setFlag(SpriteFlag.GhostThroughWalls, true)
    }


    // ============================================================
    // FIND PORTAL SURFACE
    // ============================================================

    function checkProjectile(projectile: Sprite, isBlue: boolean) {
        if (portalSurfaceTile == null) {
            return
        }

        let location = projectile.tilemapLocation()

        if (!tiles.tileAtLocationEquals(location, portalSurfaceTile)) {
            return
        }

        let nx = 0
        let ny = 0

        // Determine which direction the projectile hit from.
        if (Math.abs(projectile.vx) > Math.abs(projectile.vy)) {
            if (projectile.vx > 0) {
                nx = -1
            } else {
                nx = 1
            }
        } else {
            if (projectile.vy > 0) {
                ny = -1
            } else {
                ny = 1
            }
        }

        if (isBlue) {
            placeBluePortal(
                location.column,
                location.row,
                nx,
                ny
            )
        } else {
            placeOrangePortal(
                location.column,
                location.row,
                nx,
                ny
            )
        }

        projectile.destroy()
    }


    // ============================================================
    // TELEPORTING
    // ============================================================

    function tryTeleport() {
        if (player == null) {
            return
        }

        if (bluePortal == null || orangePortal == null) {
            return
        }

        if (teleporting) {
            return
        }

        if (game.runtime() - lastTeleportTime < teleportCooldown) {
            return
        }

        let distanceBlue = Math.sqrt(
            Math.pow(player.x - bluePortal.x, 2) +
            Math.pow(player.y - bluePortal.y, 2)
        )

        let distanceOrange = Math.sqrt(
            Math.pow(player.x - orangePortal.x, 2) +
            Math.pow(player.y - orangePortal.y, 2)
        )

        if (distanceBlue < 12) {
            if (movingIntoPortal(
                player,
                blueNormalX,
                blueNormalY
            )) {
                teleportPlayer(
                    bluePortal,
                    orangePortal,
                    blueNormalX,
                    blueNormalY,
                    orangeNormalX,
                    orangeNormalY
                )
            }
        } else if (distanceOrange < 12) {
            if (movingIntoPortal(
                player,
                orangeNormalX,
                orangeNormalY
            )) {
                teleportPlayer(
                    orangePortal,
                    bluePortal,
                    orangeNormalX,
                    orangeNormalY,
                    blueNormalX,
                    blueNormalY
                )
            }
        }
    }


    function movingIntoPortal(
        sprite: Sprite,
        nx: number,
        ny: number
    ): boolean {
        let movement = sprite.vx * nx + sprite.vy * ny

        return movement > 0
    }


    function teleportPlayer(
        entrance: Sprite,
        exit: Sprite,
        entranceNX: number,
        entranceNY: number,
        exitNX: number,
        exitNY: number
    ) {
        teleporting = true
        lastTeleportTime = game.runtime()

        let oldVX = player.vx
        let oldVY = player.vy

        let oldX = player.x
        let oldY = player.y

        // Small offset so the player doesn't get stuck
        let entranceX = entrance.x + entranceNX * 8
        let entranceY = entrance.y + entranceNY * 8

        let exitX = exit.x + exitNX * 12
        let exitY = exit.y + exitNY * 12

        player.setFlag(SpriteFlag.Ghost, true)

        let startTime = game.runtime()

        game.onUpdate(function () {
            if (!teleporting) {
                return
            }

            let elapsed = game.runtime() - startTime
            let progress = elapsed / teleportTime

            if (progress >= 1) {
                player.x = exitX
                player.y = exitY

                player.setScale(100, ScaleAnchor.Middle)

                player.vx = oldVX
                player.vy = oldVY

                player.setFlag(SpriteFlag.Ghost, false)

                teleporting = false
                return
            }

            if (progress < 0.5) {
                // Entering portal
                let p = progress * 2

                player.x = oldX +
                    (entranceX - oldX) * p

                player.y = oldY +
                    (entranceY - oldY) * p

                let scale = 100 - p * 75
                player.setScale(
                    scale,
                    ScaleAnchor.Middle
                )
            } else {
                // Coming out of portal
                let q = (progress - 0.5) * 2

                player.x = entranceX +
                    (exitX - entranceX) * q

                player.y = entranceY +
                    (exitY - entranceY) * q

                let scale2 = 25 + q * 75

                player.setScale(
                    scale2,
                    ScaleAnchor.Middle
                )
            }
        })
    }


    // ============================================================
    // REMOVE PORTALS
    // ============================================================

    //% block="remove blue portal"
    export function removeBluePortal() {
        if (bluePortal != null) {
            bluePortal.destroy()
            bluePortal = null
        }
    }

    //% block="remove orange portal"
    export function removeOrangePortal() {
        if (orangePortal != null) {
            orangePortal.destroy()
            orangePortal = null
        }
    }

    //% block="remove all portals"
    export function removeAllPortals() {
        removeBluePortal()
        removeOrangePortal()
    }


    // ============================================================
    // GAME LOOP
    // ============================================================

    game.onUpdate(function () {

        for (let projectile2 of sprites.allOfKind(blueProjectileKind)) {
            checkProjectile(projectile2, true)
        }

        for (let projectile3 of sprites.allOfKind(orangeProjectileKind)) {
            checkProjectile(projectile3, false)
        }

        tryTeleport()
    })


    // ============================================================
    // CONTROLLER EVENTS
    // ============================================================

    controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
        if (blueButton == PortalButton.A) {
            shootBluePortal()
        }

        if (orangeButton == PortalButton.A) {
            shootOrangePortal()
        }
    })


    controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
        if (blueButton == PortalButton.B) {
            shootBluePortal()
        }

        if (orangeButton == PortalButton.B) {
            shootOrangePortal()
        }
    })


    controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
        if (blueButton == PortalButton.Left) {
            shootBluePortal()
        }

        if (orangeButton == PortalButton.Left) {
            shootOrangePortal()
        }
    })


    controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
        if (blueButton == PortalButton.Right) {
            shootBluePortal()
        }

        if (orangeButton == PortalButton.Right) {
            shootOrangePortal()
        }
    })


    controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
        if (blueButton == PortalButton.Up) {
            shootBluePortal()
        }

        if (orangeButton == PortalButton.Up) {
            shootOrangePortal()
        }
    })


    controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
        if (blueButton == PortalButton.Down) {
            shootBluePortal()
        }

        if (orangeButton == PortalButton.Down) {
            shootOrangePortal()
        }
    })
}
