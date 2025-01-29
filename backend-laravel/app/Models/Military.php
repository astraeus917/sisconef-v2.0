<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Military extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'number', 'subunit_id', 'rank_id', 'workplace_id'];

    public function subunit()
    {
        return $this->belongsTo(Subunit::class);
    }

    public function rank()
    {
        return $this->belongsTo(Rank::class);
    }

    public function workplace()
    {
        return $this->belongsTo(Workplace::class);
    }
}
