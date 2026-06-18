<?php

namespace App\Services\Misc;

use App\Models\Sqlite\Master\Category;
use App\Models\Sqlite\Master\SubCategory;

class SubCategoryService
{
    private $subCategory;

    public function __construct($subCategory)
    {
        $this->subCategory = $subCategory;
    }

    public function getId()
    {
        if($this->subCategory == null) return null;
        $subCategory = SubCategory::updateOrCreate(['sub_category' => $this->subCategory], []);
        return $subCategory->id;
    }

}
