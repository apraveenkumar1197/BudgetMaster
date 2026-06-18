<?php

namespace App\Services\Misc;

use App\Models\Sqlite\Master\Category;

class CategoryService {
    private $category;
    public function __construct($category)
    {
        $this->category = $category;
    }

    public function getId(){
        if($this->category == null) return null;
        $category = Category::updateOrCreate(['category'=>$this->category],[]);
        return $category->id;
    }

}
