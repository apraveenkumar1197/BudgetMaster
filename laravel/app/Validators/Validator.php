<?php


namespace App\Validators;


use Illuminate\Http\Request;

class Validator
{
    public $message;
    public $type;
    public Request $request;
    function __construct(Request $request)
    {
        $this->request = $request;
    }

    function validate($request, $validations, $message=[]){
        $validator =  \Illuminate\Support\Facades\Validator::make($request->all(),$validations,$message);
        if($validator->fails()){
            $err = $validator->errors()->getMessages();
            $this->message = reset($err)[0];
            $this->type = key($err);
            return false;
        }
        return true;

    }

    function message(){
        return $this->message;
    }

    function respondValidationError($statusCode = 422){
        return response()->json(['type'=>$this->type, 'msg'=>$this->message()], $statusCode);
    }
}
