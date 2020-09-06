const fs = require('fs')
const path = require('path')
var Jimp = require('jimp');

const pathToImages = `${path.join(path.resolve(''))}/../events/images`

setTimeout(async () => {

    const files = fs.readdirSync(pathToImages)
    console.log(files[0])
    for (const file of files) {

        const fileId = `${pathToImages}/${file}`
        const image = await Jimp.read(fileId)

        if (image.bitmap.height > image.bitmap.width) {
            if (image.bitmap.height < 400) {
                console.log(image.bitmap.width, image.bitmap.height, file)
                image.write('old.jpg')
                await image.scale(2)
                image.write('new.jpg')
                
                return
                // const newImage = await image.scale(3)
                // newImage.write(fileId)
            }
        }
    }
})