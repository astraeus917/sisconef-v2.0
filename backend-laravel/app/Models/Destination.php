<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = ['destination'];

    public static function getIdByDestination($destination){
        return Destination::where('destination', $destination)->first()->id;
    }
}
