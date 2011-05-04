require 'rubygems'
require 'sinatra'
require 'haml'
require 'ninesixty'
require 'hpricot'
require 'open-uri'
require 'soap/wsdlDriver'
require 'json'
require 'pdfkit'
 
 configure :production do
   APP_ROOT = File.dirname(__FILE__)
   PDFKit.configure do |config|       

          config.wkhtmltopdf = APP_ROOT + '/bin/wkhtmltopdf-amd64'  

     end
     
   end
 
 
 
def object_import(xml_data)
		
		product_hash = {}
		n = xml_data.product_ListRetrieveResult.products.length
		for i in 0..n -1 do
		
		product_hash[i] = {
		  "id" => xml_data.product_ListRetrieveResult.products[i].productId ,
			"codigo" => xml_data.product_ListRetrieveResult.products[i].productCode ,
			"titulo" => xml_data.product_ListRetrieveResult.products[i].productTitle ,
			"especs" => xml_data.product_ListRetrieveResult.products[i].custom1,
			"description" => xml_data.product_ListRetrieveResult.products[i].description, 
			"precio" => xml_data.product_ListRetrieveResult.products[i].pricesSaleArray.string,
		  "imagen" => xml_data.product_ListRetrieveResult.products[i].smallImage}

		end
	return product_hash
end

post '/toPdf' do
  APP_ROOT = File.dirname(__FILE__)
  
  Mime::Type.register_alias "application/pdf", :pdf
  
  html = params['html'];
  #html.inspect
  kit = PDFKit.new(html, :page_size => 'Letter')
 kit.stylesheets << APP_ROOT + '/public/stylesheets/grid.css'

   #send_data(kit.to_pdf) 
 # Git an inline PDF
  pdf = kit.to_pdf
  file = kit.to_file(APP_ROOT + '/tmp/print2.pdf')
  f = APP_ROOT + '/tmp/print2.pdf';
  send_file(f,  :type => 'application/pdf', :filename => "DocRaptor.pdf")
  #redirect '/temp/print.pdf'
  
  #pdf = kit.to_pdf
  
end

get '/print' do
  haml :print6
end


get '/' do
  haml :impresiones
end

get '/getDataLocal' do
  return '{"129":{"imagen":"/images/catalogo/Targus/TSB16801US.jpg","especs":"Diseñado para portátiles de hasta 16\",Compartimiento con forro 360 Airmesh para extra protección,Contruido en nylon resistente al agua,Color marrón","titulo":"Targus Mochila Unofficial 16\" TSB16801US","precio":"US/51.00","codigo":"TARTEMP03","id":"1713554","description":"#"},"18":{"imagen":"/images/catalogo/BTCServer/SuperMicro1UB.jpg","especs":"1 INTEL XEON X3440, 8GB ECC DDR3 EXPANDIBLE 32GB ECC DDR3, 2 DISCO ENTERPRISE 500GB SATA 3GB/S, \n2 LAN GIGABIT, 2 BAHÍAS INTERNAS 3.5”, MÓDULO INTEGRADO DE ADMINISTRACIÓN REMOTA, MÓDULO INTEGRADO \nRAID 0,1,5,10 WINDOWS, RAID 0, 1, 10 LINUX, CHASIS MINI","titulo":"BTC Supreme Server BR1108-1TB","precio":"US/1599.00","codigo":"BTC0099","id":"1713469","description":"Este servidor es una solución potente y estable para utilizar en ambiente de racks."},"55":{"imagen":"/images/catalogo/Kingston/DT10132GB.jpg","especs":"Compatible con Windows 7, Vista, XP & Mac.,urDrive Software.,Variedad de Colores.,Diseño giratorio sin tapa., Capacidad 32GB.","titulo":"Kingston Datatraveler DT101 32GB","precio":"US/75.00","codigo":"KIN0224","id":"1713500","description":"Almacene, transporte y transfiera sus fotos, música, videos, archivos y mas con las unidades Data Traveler de Kingston tipo USB Flash."},"92":{"imagen":"/images/catalogo/Microsoft/Desktop800.jpg","especs":"Cómodas teclas de acceso rápido,Botón de inicio de Windows,Tecnología óptica de Microsoft hata 1000 dpi,Conector USB ultracompacto,La tecnología inalámbrica de Microsoft a 2.4 GHz proporciona una conexión de confianza y segura con un alcance de hasta 4 mt","titulo":"Microsoft Teclado y Mouse Wireless Desktop 800","precio":"US/39.00","codigo":"MIC0052","id":"1713535","description":"Control y comodidad al alcance de su mano con este teclado compacto y ratón fiable."},"37":{"imagen":"/images/catalogo/Hitachi/OS00391.jpg","especs":"500 Gb de capacidad,Interfaz USB 2.0, Perfil ultraportable de 2.5 pulgadas,Software de respaldo automático, No requiere conexión a tomacorriente","titulo":"Hitachi DD Externo OS00391 500GB","precio":"US/110.00","codigo":"HIT0005","id":"1738347","description":"Mantén tu información segura y a mano con este disco ultraportable."},"74":{"imagen":"/images/catalogo/Linksys/WUSB54GC.jpg","especs":"Opera en frecuencia G de 2.4Ghz para velocidades de hasta 54mps,Interfaz USB para instalar en computadores de escritorio o portátiles,Encriptación WPA y WEP","titulo":"Linksys Adaptador USB Wifi G WUSB54GC","precio":"US/38.00","codigo":"LNK0009","id":"1713518","description":"Conéctese sin cables en más lugares. Sólo tiene que conectar el adaptador USB Wireless-G compacto fácil de llevar al ordenador y prepararse para disfrutar de la comodidad de las redes inalámbricas sin necesidad de utilizar ningún cable."},"111":{"imagen":"/images/catalogo/Samsung/HX-DU01EC.jpg","especs":"1.5 TB de capacidad,Interfaz USB,Perfil de 3.5 pulgadas, Software de respaldo automático y encriptación","titulo":"Samsung DD Externo G3 1.5 TB","precio":"US/190.00","codigo":"SAM0043","id":"1738345","description":"Disco duro externo de escritorio de alta capacidad."}}'
end

get '/getData' do
  ENV['SHOWSOAP'] = 'true'
  url = 'http://www.btc.cr/CatalystWebService/CatalystEcommerceWebservice.asmx?WSDL'
	driver = SOAP::WSDLDriverFactory.new(url).create_rpc_driver
	driver.options['protocol.http.ssl_config.verify_mode'] = OpenSSL::SSL::VERIFY_NONE
	result= driver.Product_ListRetrieve(:Username=> "rrodriguez@incompanysolutions.com",:Password => "monomono",:SiteId =>100917,:CatalogId =>"-1")
  return object_import(result).to_json;
  
end



  