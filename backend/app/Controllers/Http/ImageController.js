'use strict'

const Helpers = use('Helpers')
const Property = use('App/Models/Property')

class ImageController {

  async show({ params, response }) {
    return response.download(Helpers.tmpPath(`uploads/${params.path}`))
  }

  async store ({ params, request }) {
    const property = await Property.findOrFail(params.id)

    const images = request.file('image', {
      types: ['image'],
      size: '4mb'
    })

    await images.moveAll(Helpers.tmpPath('uploads'), file => ({
      name: `${Date.now()}-${file.clientName}`
    }))

    if (!images.moveAll()) {
      return images.error()
    }

    await Promise.all(
      images
        .movedList()
        .map(image => property.images().create({ path: image.fileName }))
    )
  }
}

module.exports = ImageController
