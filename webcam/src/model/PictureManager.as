package model
{
	
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.DisplayObject;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.geom.Matrix;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.net.URLRequestHeader;
	import flash.net.URLRequestMethod;
	import flash.utils.ByteArray;
	
	import mx.collections.ArrayCollection;
	import mx.graphics.codec.JPEGEncoder;
	import mx.utils.Base64Encoder;
	
	public class PictureManager
	{
		
		public function PictureManager()
		{
			
		}
		
		public function savePicture(source:DisplayObject):ByteArray {
			var jpe:JPEGEncoder = new JPEGEncoder(100);
			var imageBitmap:Bitmap = new Bitmap( copyBitmap(source) );
			
			//flip horizontal matrix
			var flipHorizontalMatrix:Matrix = new Matrix()
			flipHorizontalMatrix.scale(-1,1)
			flipHorizontalMatrix.translate(imageBitmap.width,0)
			
			var flippedBitmap:BitmapData = new BitmapData(imageBitmap.width,imageBitmap.height,false,0xFFCC00)
			flippedBitmap.draw(imageBitmap,flipHorizontalMatrix)
			
			var data:ByteArray = jpe.encode( flippedBitmap );
			
			return data;
			/*var image:File = pictureDirectory.resolvePath(new Date().time + ".jpg");
			var fs:FileStream = new FileStream();
			fs.open(image,FileMode.WRITE);
			fs.writeBytes(data);
			fs.close();
			trace(image.nativePath);
			
			pictures.addItem( new Picture(image as File) );*/
			
		}
		/*public function upload(picture:Picture):void {
			var file:File = new File(picture.url);
			if ( file ) {
				twitterUpload(file);
				//uploadMyFile(file);
			}
		}*/
		private function copyBitmap(source:DisplayObject):BitmapData {
			var bmd:BitmapData = new BitmapData(source.width, source.height);
			bmd.draw(source);
			return bmd
		}
		private function onFault(event:Event):void {
			
		}
		private function onProgress(event:ProgressEvent):void {
			trace('Image uploading: %' + event.bytesLoaded*100/event.bytesTotal)
		}
		private function onComplete(event:Event):void {
			trace('Image Uploaded');
		}
		
		/*private function twitterUpload(file:File):void {
			var fs:FileStream = new FileStream();
			fs.open(file,FileMode.READ);
			var jpegDataByteArray:ByteArray = new ByteArray();
			fs.readBytes(jpegDataByteArray);
			
			var multi:MultipartRequest = new MultipartRequest();
			multi.file = jpegDataByteArray;
			multi.filename = file.name;
			
			var postdata:ByteArray = multi.getPostData();
			
			var req:URLRequest = new URLRequest();
			req.method = URLRequestMethod.POST;
			req.contentType = "multipart/form-data; boundary=" + multi.getBoundary();
			req.data = postdata;
			req.url = "http://twitter.com/account/update_profile_image.xml";
			//var base64:Base64Encoder = new Base64Encoder();
			//base64.encode ("username" + ":" + "password");
			//req.requestHeaders.push(new URLRequestHeader ("Authorization", "Basic " + base64.toString()));
			
			var ldr:URLLoader = new URLLoader();
			ldr.addEventListener(IOErrorEvent.IO_ERROR, onFault);
			ldr.addEventListener(ProgressEvent.PROGRESS, onProgress);
			ldr.addEventListener(Event.COMPLETE, onComplete);
			ldr.load(req);
			
		}*/
		
	}
}