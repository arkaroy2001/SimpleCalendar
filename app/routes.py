from flask import render_template, flash, redirect, url_for
from .forms import LoginForm
from app import cal_app


@cal_app.route('/')
@cal_app.route('/index')
def index():
    return render_template('index.html',title='Home')


@cal_app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        flash('Login requested for user {}, remember_me={}'.format(
            form.username.data, form.remember_me.data))
        return redirect(url_for('index'))
    return render_template('login.html', title='Sign In', form=form)
