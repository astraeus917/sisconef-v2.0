<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Presence extends Model
{
    use HasFactory;

    protected $fillable = ['date', 'military_id', 'destination_id', 'dayoff_start', 'dayoff_end'];
}
