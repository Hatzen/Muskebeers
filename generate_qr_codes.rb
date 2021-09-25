require "rqrcode"
require "json"

questions = JSON.parse(File.read('api/static/data/questions.geojson'))['features']
uuids = questions.map { |q| q['properties']['id'] }

uuids.each do |uuid|
  qrcode = RQRCode::QRCode.new(uuid)

  # NOTE: showing with default options specified explicitly
  png = qrcode.as_png(
    bit_depth: 1,
    border_modules: 4,
    color_mode: ChunkyPNG::COLOR_GRAYSCALE,
    color: "black",
    file: nil,
    fill: "white",
    module_px_size: 6,
    resize_exactly_to: false,
    resize_gte_to: false,
    size: 256
  )

  IO.binwrite("qr_codes/#{uuid}.png", png.to_s)
end
