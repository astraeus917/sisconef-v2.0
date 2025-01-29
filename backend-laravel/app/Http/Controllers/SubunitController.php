<?php

namespace App\Http\Controllers;

use App\Models\Subunit;
use Illuminate\Http\Request;

class SubunitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $subunits = Subunit::all();
        return response()->json($subunits);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Subunit $subunit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Subunit $subunit)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Subunit $subunit)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subunit $subunit)
    {
        //
    }
}
