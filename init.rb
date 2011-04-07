require 'rubygems'
require 'sinatra'
require 'haml'
require 'ninesixty'
require 'hpricot'
require 'open-uri'
require 'soap/wsdlDriver'

def render_file(filename)
  contents = File.read('views/'+filename+'.haml')
  Haml::Engine.new(contents).render
end


def object_import(xml_data)
		
		product_hash = {}
		n = xml_data.product_ListRetrieveResult.products.length
		for i in 0..n -1 do
		
		product_hash[i] = {
			"titulo" => xml_data.product_ListRetrieveResult.products[i].productTitle ,
			"especs" => xml_data.product_ListRetrieveResult.products[i].custom1,
			"precio" => xml_data.product_ListRetrieveResult.products[i].pricesSaleArray.string,
		  "imagen" => xml_data.product_ListRetrieveResult.products[i].smallImage}

		end
	return product_hash
end

get '/connect' do
  ENV['SHOWSOAP'] = 'true'
  url = 'http://www.btc.cr/CatalystWebService/CatalystEcommerceWebservice.asmx?WSDL'
	driver = SOAP::WSDLDriverFactory.new(url).create_rpc_driver
	#driver.options['protocol.http.ssl_config.verify_mode'] = OpenSSL::SSL::VERIFY_NONE
	result= driver.Product_ListRetrieve(:Username=> "rrodriguez@incompanysolutions.com",:Password => "monomono",:SiteId =>100917,:CatalogId =>"-1")
	#result.inspect
  object_import(result).inspect
end



get '/print' do
  codes = params['codes'];
  arr = codes.split(",")
  
   @codes = []
 	 @names = []
 	 @descriptions = []
 	 @images = []
   @prices = []
   
   f =  open("http://btc.cr/productfeed.xml") do |f|
   doc = Hpricot.XML(f)
     i=0
    arr.each do |code|
       t = '//code[text()="' + code + '"]/..'
       
       (doc / t ) .each do |p|
       @codes[i] = (p/"code").inner_html
       @names[i]= (p/"name").inner_html
       @descriptions[i]= (p/"description").inner_html
       @images[i]= (p/"image_small").inner_html 
       @prices[i]= (p/"sellprice_us").inner_html
       i+=1
     end
   end
   
   
   end
  
  if arr.length ==1
   haml :print1 , {:layout => :layout_half}
 else arr.length == 6
   haml :print6
 end
   
end

get '/' do
  
 f = open("http://btc.cr/productfeed.xml") do |f|
 @doc = Hpricot.XML(f)
  
  #fh = File.open("/public/productfeed.xml","r")
	#@doc = Hpricot(fh)
	#fh.close
  
	@codes = []
	@names = []
	@descriptions = []
	@images = []
	@prices = []
	
  @n = (@doc/"product").length #tamaño 
 	 	
 	for i in 0..@n -1 do
 	  @codes[i]= (@doc/"code")[i].inner_html
		@names[i]= (@doc/"name")[i].inner_html
		@descriptions[i]= (@doc/"description")[i].inner_html
		#@images[i]= (@doc/"image_small")[i].inner_html 
		@prices[i]= (@doc/"sellprice_us")[i].inner_html
		end
 haml :index
  
  end
 

 
end
