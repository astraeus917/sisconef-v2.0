<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Subunit;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return User::with('subunit:id,name') // Includes the name of the subunit.
            ->select('id', 'username', 'role', 'subunit_id') // Select only the required fields.
            ->get();
    }

    public function login(Request $request)
    {
        $request->validate([
            'username'=>'required',
            'password'=>'required',
        ]);

        $user = User::where('username', $request -> username) -> first();

        if (!$user) {
            return response()->json([
                'message' => 'nouser'
            ]);
        }

        $credentials = [
            'username' => $request->username,
            'password' => $request->password
        ];

        if (Auth::attempt($credentials)) {
            $token = $user->createToken('MyAppToken')->plainTextToken; // Auth token.

            $user = Auth::user(); // Retrieve user information..
            $user_id = $user->id; // User ID.
            $user_role = $user->role; // Role.
            $user_subunit = $user->subunit_id; // Subunit.

            return response()->json([
                'token' => $token,
                'user_id' => $user_id,
                'user_role' => $user_role,
                'user_subunit' => $user_subunit,
                'message' => 'success'
            ], 200);
        } else {
            return response()->json([
                'message' => 'error'
            ]);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'username'=>'required|unique:users',
            'password'=>'required',
            'subunit_id'=>'required',
            'role'=>'required'
        ]);
        try {
            User::create([
                $request->post(),
                'username' => $request->username,
                'password' => $request->password,
                'subunit_id' => $request->subunit_id,
                'role' => $request->role
            ]);
            return response()->json([
                'message'=>'Usuário registrado!'
            ]);
        } catch(\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message'=>'Houve um problema e não foi possível registrar o usuário.'
            ], 500);
        }
    }

    public function show(User $user)
    {
        // Search for the name of the subunit referring to the user.
        $subunit = $user->subunit;
    
        return response()->json([
            'user' => [
                'username' => $user->username,
                'subunit_id' => $user->subunit_id,
                'role' => $user->role,
                'subunit_name' => $subunit ? $subunit->name : null,
            ]
        ]);
    }

    public function changePassword(Request $request, $id)
    {
        $request->validate([
            'password' => 'required'
        ]);

        $user = User::find($id);
    
        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado.'], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();
    
        return response()->json(['message' => 'Senha alterada com sucesso!']);
    }
}
