<?php

namespace App\Http\Middleware;

use App\Services\DB\SqliteSetup;
use Closure;
use Illuminate\Http\Request;

class SetSqliteConfigMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    function handle(Request $request, Closure $next)
    {
        new SqliteSetup(auth()->user());
        return $next($request);
    }
}
