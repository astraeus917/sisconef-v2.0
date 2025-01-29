<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Layoff extends Model
{
    use HasFactory;
    protected $fillable = ['date_start', 'date_end', 'military_id', 'destination_id'];
}